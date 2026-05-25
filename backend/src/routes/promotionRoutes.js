const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotionController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/public").get(promotionController.getPublicPromotions);

router.route("/").get(protect, admin, promotionController.getAll).post(protect, admin, promotionController.create);

router.route("/:id/status").patch(protect, admin, promotionController.updateStatus);

router
  .route("/:id")
  .get(protect, admin, promotionController.getById)
  .put(protect, admin, promotionController.update)
  .delete(protect, admin, promotionController.delete);

module.exports = router;
