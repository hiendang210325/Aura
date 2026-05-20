const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

// --- HELPERS ---

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw createHttpError(500, 'JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

const serializeUser = (user) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

const sendAuthResponse = (res, statusCode, user) => {
  return res.status(statusCode).json({
    ...serializeUser(user),
    token: generateToken(user._id.toString()),
  });
};

// --- CONTROLLERS ---

const registerUser = asyncHandler(async (req, res, next) => {
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

  // Check if user exists (to fail fast)
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

    return sendAuthResponse(res, 201, user);
  } catch (error) {
    // Handle MongoDB unique index violation (Error code 11000)
    if (error.code === 11000) {
      throw createHttpError(400, 'Email is already registered');
    }
    throw error;
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, 'Please provide email and password');
  }

  email = email.trim().toLowerCase();

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  return sendAuthResponse(res, 200, user);
});

const loginAdmin = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, 'Please provide email and password');
  }

  email = email.trim().toLowerCase();

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  // Kiểm tra thêm điều kiện role phải là admin
  if (user.role !== 'admin') {
    throw createHttpError(403, 'Access denied. Admin resources only.');
  }

  return sendAuthResponse(res, 200, user);
});

const getUserProfile = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw createHttpError(401, 'Not authorized, user not found in request');
  }

  // Nếu authMiddleware đã gắn req.user từ DB, ta không cần query lại
  return res.status(200).json(serializeUser(req.user));
});

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getUserProfile,
};
