const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Route công khai: Khách hàng đặt bàn từ website (không cần đăng nhập)
router.route("/public").post(reservationController.createPublic);

// Chức năng này dành cho Admin quản lý
router
  .route("/")
  .get(protect, admin, reservationController.getAll)
  .post(protect, admin, reservationController.create);

router
  .route("/:id")
  .put(protect, admin, reservationController.update)
  .delete(protect, admin, reservationController.delete);

router.route("/:id/status").patch(protect, admin, reservationController.updateStatus);

module.exports = router;
