const express = require("express");
const router = express.Router();
const {
  getReviews,
  createReview,
  updateReview,
  updateReviewReply,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/").get(protect, admin, getReviews).post(protect, admin, createReview);

router.route("/:id/reply").patch(protect, admin, updateReviewReply);
router.route("/:id/status").patch(protect, admin, updateReviewStatus);

router.route("/:id").put(protect, admin, updateReview).delete(protect, admin, deleteReview);

module.exports = router;
