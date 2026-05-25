const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/").get(protect, admin, reviewController.getAll).post(protect, admin, reviewController.create);

router.route("/:id/reply").patch(protect, admin, reviewController.updateReply);
router.route("/:id/status").patch(protect, admin, reviewController.updateStatus);

router.route("/:id").put(protect, admin, reviewController.update).delete(protect, admin, reviewController.delete);

module.exports = router;
