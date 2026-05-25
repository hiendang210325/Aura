const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");
const { protect, admin } = require("../middlewares/authMiddleware");

// GET: Any authenticated user can view tables
router.route("/").get(protect, tableController.getAll).post(protect, admin, tableController.create);

// PUT / DELETE: Admin only
router
  .route("/:id")
  .put(protect, admin, tableController.update)
  .delete(protect, admin, tableController.delete);

module.exports = router;
