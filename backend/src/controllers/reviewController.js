const Review = require("../models/reviewModel");
const BaseController = require("./BaseController");
const BaseRepository = require("../repositories/BaseRepository");

/**
 * ReviewController — Kế thừa BaseController, override buildPayload
 * để ép kiểu rating, và thêm method updateReply.
 */
class ReviewController extends BaseController {
  constructor() {
    super(new BaseRepository(Review), "đánh giá", {
      editableFields: ["customer", "phone", "rating", "date", "source", "text", "status", "reply"],
      searchFields: ["customer", "phone", "source", "text", "reply"],
      defaultSort: { createdAt: -1 },
    });

    // Bind method riêng
    this.updateReply = this.updateReply.bind(this);
  }

  /** Override: Thêm logic ép rating thành Number */
  buildPayload(body) {
    const payload = super.buildPayload(body);

    if (Object.prototype.hasOwnProperty.call(payload, "rating")) {
      payload.rating = Number(payload.rating);
    }

    return payload;
  }

  /**
   * PATCH /:id/reply — Cập nhật phản hồi cho đánh giá.
   * Tự động set status thành "Đã phản hồi".
   */
  async updateReply(req, res, next) {
    try {
      const { reply } = req.body;
      const review = await this.repository.updateById(
        req.params.id,
        { reply: reply || "", status: "Đã phản hồi" }
      );

      if (!review) {
        res.status(404);
        return next(new Error("Không tìm thấy đánh giá"));
      }

      res.json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReviewController();
