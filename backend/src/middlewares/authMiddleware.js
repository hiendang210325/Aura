const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getAccessTokenSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw createHttpError(500, 'JWT access secret is not defined');
  }
  return secret;
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, getAccessTokenSecret());

      if (decoded.type && decoded.type !== 'access') {
        return next(createHttpError(401, 'Not authorized, invalid token type'));
      }

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return next(createHttpError(401, 'Not authorized, user not found'));
      }

      return next();
    } catch (error) {
      return next(
        error.statusCode ? error : createHttpError(401, 'Not authorized, token failed')
      );
    }
  }

  if (!token) {
    return next(createHttpError(401, 'Not authorized, no token'));
  }
};

const optionalProtect = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, getAccessTokenSecret());

    if (decoded.type && decoded.type !== 'access') {
      return next();
    }

    req.user = await User.findById(decoded.id).select('-password');
  } catch (error) {
    req.user = null;
  }

  return next();
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(createHttpError(403, 'Not authorized as an admin'));
  }
};

module.exports = { protect, optionalProtect, admin };
