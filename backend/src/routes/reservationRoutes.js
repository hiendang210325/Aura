const express = require('express');
const router = express.Router();
const {
  getReservations,
  createReservation,
  createPublicReservation,
  updateReservation,
  updateReservationStatus,
  deleteReservation
} = require('../controllers/reservationController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Route công khai: Khách hàng đặt bàn từ website (không cần đăng nhập)
router.route('/public')
  .post(createPublicReservation);

// Chức năng này dành cho Admin quản lý
router.route('/')
  .get(protect, admin, getReservations)
  .post(protect, admin, createReservation);

router.route('/:id')
  .put(protect, admin, updateReservation)
  .delete(protect, admin, deleteReservation);

router.route('/:id/status')
  .patch(protect, admin, updateReservationStatus);

module.exports = router;
