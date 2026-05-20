const express = require("express");
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  updateMenuItemStatus,
  deleteMenuItem,
} = require("../controllers/menuController");
const { protect, admin } = require("../middlewares/authMiddleware");

// GET: Bất kỳ ai cũng xem được thực đơn (Public)
router.route("/").get(getMenuItems).post(protect, admin, createMenuItem);

// Cập nhật nhanh trạng thái
router.route("/:id/status").patch(protect, admin, updateMenuItemStatus);

// CRUD đơn lẻ theo ID
router
  .route("/:id")
  .get(getMenuItemById)
  .put(protect, admin, updateMenuItem)
  .delete(protect, admin, deleteMenuItem);

module.exports = router;
