const express = require("express");
const router = express.Router();
const comboController = require("../controllers/comboController");
const { protect, admin } = require("../middlewares/authMiddleware");

// GET: Bất kỳ ai cũng xem được combos (Public)
router.route("/").get(comboController.getAll).post(protect, admin, comboController.create);

router.route("/:id/status").patch(protect, admin, comboController.updateStatus);

router
  .route("/:id")
  .get(comboController.getById)
  .put(protect, admin, comboController.update)
  .delete(protect, admin, comboController.delete);

module.exports = router;
