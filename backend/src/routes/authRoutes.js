const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  registerUser,
  loginUser,
  loginAdmin,
  refreshAccessToken,
  logoutUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

router.post('/login', loginUser);
router.post('/admin/login', loginAdmin);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

router.route('/profile').get(protect, getUserProfile);

module.exports = router;
