const express = require("express");
const router = express.Router();
const {
  getPromotions,
  getPublicPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  updatePromotionStatus,
  deletePromotion,
} = require("../controllers/promotionController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/public").get(getPublicPromotions);

router.route("/").get(protect, admin, getPromotions).post(protect, admin, createPromotion);

router.route("/:id/status").patch(protect, admin, updatePromotionStatus);

router
  .route("/:id")
  .get(protect, admin, getPromotionById)
  .put(protect, admin, updatePromotion)
  .delete(protect, admin, deletePromotion);

module.exports = router;
