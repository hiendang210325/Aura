const express = require("express");
const router = express.Router();
const {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} = require("../controllers/tableController");
const { protect, admin } = require("../middlewares/authMiddleware");

// GET: Any authenticated user can view tables
router.route("/").get(protect, getTables).post(protect, admin, createTable);

// PUT / DELETE: Admin only
router
  .route("/:id")
  .put(protect, admin, updateTable)
  .delete(protect, admin, deleteTable);

module.exports = router;
