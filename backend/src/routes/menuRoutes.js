const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { protect, admin } = require("../middlewares/authMiddleware");

// GET: Bất kỳ ai cũng xem được thực đơn (Public)
router.route("/").get(menuController.getAll).post(protect, admin, menuController.create);

// Cập nhật nhanh trạng thái
router.route("/:id/status").patch(protect, admin, menuController.updateStatus);

// CRUD đơn lẻ theo ID
router
  .route("/:id")
  .get(menuController.getById)
  .put(protect, admin, menuController.update)
  .delete(protect, admin, menuController.delete);

module.exports = router;
