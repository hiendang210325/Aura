const express = require("express");
const router = express.Router();
const {
  getCombos,
  getComboById,
  createCombo,
  updateCombo,
  updateComboStatus,
  deleteCombo,
} = require("../controllers/comboController");
const { protect, admin } = require("../middlewares/authMiddleware");

// GET: Bất kỳ ai cũng xem được combos (Public)
router.route("/").get(getCombos).post(protect, admin, createCombo);

router.route("/:id/status").patch(protect, admin, updateComboStatus);

router
  .route("/:id")
  .get(getComboById)
  .put(protect, admin, updateCombo)
  .delete(protect, admin, deleteCombo);

module.exports = router;
