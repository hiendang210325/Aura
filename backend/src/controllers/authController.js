const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');

const REFRESH_TOKEN_COOKIE_NAME =
  process.env.REFRESH_TOKEN_COOKIE_NAME || 'aura_refresh_token';
const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = '15m';
const DEFAULT_REFRESH_TOKEN_EXPIRES_IN = '7d';

// --- HELPERS ---

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getRequiredSecret = (value, name) => {
  if (!value) {
    throw createHttpError(500, `${name} is not defined in environment variables`);
  }

  return value;
};

const getAccessTokenSecret = () =>
  getRequiredSecret(
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    'JWT access secret',
  );

const getRefreshTokenSecret = () =>
  getRequiredSecret(
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    'JWT refresh secret',
  );

const parseDurationMs = (duration) => {
  if (!duration) return null;

  const match = String(duration).trim().match(/^(\d+)(ms|s|m|h|d)?$/i);
  if (!match) return null;

  const amount = Number(match[1]);
  const unit = (match[2] || 's').toLowerCase();
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
};

const getRefreshTokenTtlMs = () => {
  const configuredExpiresIn =
    process.env.JWT_REFRESH_EXPIRES_IN || DEFAULT_REFRESH_TOKEN_EXPIRES_IN;
  const ttlMs = parseDurationMs(configuredExpiresIn);

  return ttlMs || 7 * 24 * 60 * 60 * 1000;
};

const getCookieValue = (req, name) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));
  if (!cookie) return null;

  try {
    return decodeURIComponent(cookie.slice(name.length + 1));
  } catch (error) {
    return cookie.slice(name.length + 1);
  }
};

const getRefreshTokenFromRequest = (req) =>
  getCookieValue(req, REFRESH_TOKEN_COOKIE_NAME) || req.body?.refreshToken || null;

const hashRefreshToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const serializeUser = (user) => {
  const id = user._id.toString();

  return {
    _id: id,
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const generateAccessToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      type: 'access',
    },
    getAccessTokenSecret(),
    {
      expiresIn:
        process.env.JWT_ACCESS_EXPIRES_IN || DEFAULT_ACCESS_TOKEN_EXPIRES_IN,
    },
  );

const generateRefreshToken = (user) => {
  const expiresIn =
    process.env.JWT_REFRESH_EXPIRES_IN || DEFAULT_REFRESH_TOKEN_EXPIRES_IN;
  const ttlMs = getRefreshTokenTtlMs();
  const expiresAt = new Date(Date.now() + ttlMs);
  const token = jwt.sign(
    {
      id: user._id.toString(),
      type: 'refresh',
    },
    getRefreshTokenSecret(),
    { expiresIn },
  );

  return {
    token,
    tokenHash: hashRefreshToken(token),
    expiresAt,
  };
};

const setRefreshTokenCookie = (res, refreshToken, expiresAt) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: process.env.REFRESH_TOKEN_SAME_SITE || (isProduction ? 'strict' : 'lax'),
    expires: expiresAt,
    path: '/api/v1/auth',
  });
};

const clearRefreshTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: process.env.REFRESH_TOKEN_SAME_SITE || (isProduction ? 'strict' : 'lax'),
    path: '/api/v1/auth',
  });
};

const persistRefreshToken = async (user, tokenHash, expiresAt) => {
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        refreshTokenHash: tokenHash,
        refreshTokenExpiresAt: expiresAt,
      },
    },
  );
};

const clearRefreshTokenByHash = async (tokenHash) => {
  await User.updateOne(
    { refreshTokenHash: tokenHash },
    {
      $unset: {
        refreshTokenHash: '',
        refreshTokenExpiresAt: '',
      },
    },
  );
};

const issueAuthResponse = async (res, statusCode, user) => {
  const refreshToken = generateRefreshToken(user);
  await persistRefreshToken(user, refreshToken.tokenHash, refreshToken.expiresAt);
  setRefreshTokenCookie(res, refreshToken.token, refreshToken.expiresAt);

  const accessToken = generateAccessToken(user);
  const userPayload = serializeUser(user);

  return res.status(statusCode).json({
    ...userPayload,
    user: userPayload,
    accessToken,
    token: accessToken,
    tokenType: 'Bearer',
    expiresIn:
      process.env.JWT_ACCESS_EXPIRES_IN || DEFAULT_ACCESS_TOKEN_EXPIRES_IN,
  });
};

const findUserForRefreshToken = async (refreshToken) => {
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, getRefreshTokenSecret());
  } catch (error) {
    throw createHttpError(401, 'Refresh token is invalid or expired');
  }

  if (decoded.type && decoded.type !== 'refresh') {
    throw createHttpError(401, 'Invalid refresh token type');
  }

  const tokenHash = hashRefreshToken(refreshToken);
  const user = await User.findById(decoded.id).select(
    '+refreshTokenHash +refreshTokenExpiresAt',
  );

  if (
    !user ||
    !user.refreshTokenHash ||
    user.refreshTokenHash !== tokenHash ||
    !user.refreshTokenExpiresAt ||
    user.refreshTokenExpiresAt.getTime() <= Date.now()
  ) {
    throw createHttpError(401, 'Refresh token is invalid or expired');
  }

  return user;
};

// --- CONTROLLERS ---

const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createHttpError(400, errors.array()[0].msg);
  }

  const { name, password } = req.body;
  let { email } = req.body;

  if (!email || !password || !name) {
    throw createHttpError(400, 'Please provide all required fields');
  }

  email = email.trim().toLowerCase();

  const userExists = await User.findOne({ email }).lean();
  if (userExists) {
    throw createHttpError(400, 'Email is already registered');
  }

  try {
    const user = await User.create({
      name: name.trim(),
      email,
      password,
    });

    return issueAuthResponse(res, 201, user);
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(400, 'Email is already registered');
    }
    throw error;
  }
});

const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, 'Please provide email and password');
  }

  email = email.trim().toLowerCase();

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  return issueAuthResponse(res, 200, user);
});

const loginAdmin = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, 'Please provide email and password');
  }

  email = email.trim().toLowerCase();

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  if (user.role !== 'admin') {
    throw createHttpError(403, 'Access denied. Admin resources only.');
  }

  return issueAuthResponse(res, 200, user);
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = getRefreshTokenFromRequest(req);

  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is required');
  }

  try {
    const user = await findUserForRefreshToken(refreshToken);
    return issueAuthResponse(res, 200, user);
  } catch (error) {
    clearRefreshTokenCookie(res);
    throw error;
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = getRefreshTokenFromRequest(req);

  if (refreshToken) {
    await clearRefreshTokenByHash(hashRefreshToken(refreshToken));
  }

  clearRefreshTokenCookie(res);

  return res.status(200).json({ message: 'Logged out successfully' });
});

const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, 'Not authorized, user not found in request');
  }

  return res.status(200).json(serializeUser(req.user));
});

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  refreshAccessToken,
  logoutUser,
  getUserProfile,
};
