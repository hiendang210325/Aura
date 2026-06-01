const User = require('../models/userModel');

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const serializeUser = (user) => {
  const id = user._id.toString();

  return {
    _id: id,
    id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const buildUserFilter = (query) => {
  const filter = {};

  if (query.role && ['user', 'admin'].includes(query.role)) {
    filter.role = query.role;
  }

  if (query.search) {
    const search = new RegExp(String(query.search).trim(), 'i');
    filter.$or = [{ name: search }, { email: search }];
  }

  return filter;
};

const isSameUser = (req, userId) =>
  req.user && req.user._id.toString() === userId.toString();

const ensureEmailAvailable = async (email, ignoreUserId) => {
  const existingUser = await User.findOne({ email }).lean();

  if (
    existingUser &&
    (!ignoreUserId || existingUser._id.toString() !== ignoreUserId.toString())
  ) {
    throw createHttpError(400, 'Email is already registered');
  }
};

const ensureAdminCanBeChanged = async (user, nextRole) => {
  const isRemovingAdmin = user.role === 'admin' && nextRole !== 'admin';
  if (!isRemovingAdmin) return;

  const adminCount = await User.countDocuments({ role: 'admin' });
  if (adminCount <= 1) {
    throw createHttpError(400, 'At least one admin account is required');
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find(buildUserFilter(req.query))
      .select('-password -refreshTokenHash -refreshTokenExpiresAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users.map(serializeUser),
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');
    const role = req.body.role === 'admin' ? 'admin' : 'user';

    if (!name || !email || !password) {
      throw createHttpError(400, 'Please provide name, email and password');
    }

    if (password.length < 6) {
      throw createHttpError(400, 'Password must be at least 6 characters');
    }

    await ensureEmailAvailable(email);

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({ success: true, data: serializeUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return next(createHttpError(400, 'Email is already registered'));
    }
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      '+password +refreshTokenHash +refreshTokenExpiresAt',
    );

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const nextName = Object.prototype.hasOwnProperty.call(req.body, 'name')
      ? String(req.body.name || '').trim()
      : user.name;
    const nextEmail = Object.prototype.hasOwnProperty.call(req.body, 'email')
      ? normalizeEmail(req.body.email)
      : user.email;
    const nextRole = ['user', 'admin'].includes(req.body.role)
      ? req.body.role
      : user.role;
    const nextPassword = Object.prototype.hasOwnProperty.call(req.body, 'password')
      ? String(req.body.password || '')
      : null;

    if (!nextName || !nextEmail) {
      throw createHttpError(400, 'Name and email are required');
    }

    if (nextPassword !== null && nextPassword.length > 0 && nextPassword.length < 6) {
      throw createHttpError(400, 'Password must be at least 6 characters');
    }

    if (isSameUser(req, user._id) && nextRole !== 'admin') {
      throw createHttpError(400, 'You cannot remove your own admin role');
    }

    await ensureEmailAvailable(nextEmail, user._id);
    await ensureAdminCanBeChanged(user, nextRole);

    user.name = nextName;
    user.email = nextEmail;
    user.role = nextRole;

    if (nextPassword) {
      user.password = nextPassword;
      user.refreshTokenHash = undefined;
      user.refreshTokenExpiresAt = undefined;
    }

    await user.save();

    res.json({ success: true, data: serializeUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return next(createHttpError(400, 'Email is already registered'));
    }
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    if (isSameUser(req, user._id)) {
      throw createHttpError(400, 'You cannot delete your own account');
    }

    await ensureAdminCanBeChanged(user, 'user');
    await user.deleteOne();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
