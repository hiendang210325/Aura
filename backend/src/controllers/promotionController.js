const Promotion = require("../models/promotionModel");
const BaseController = require("./BaseController");
const BaseRepository = require("../repositories/BaseRepository");

/**
 * PromotionController — Kế thừa BaseController, override buildPayload
 * để ép kiểu displayOrder, và thêm method getPublicPromotions.
 */
class PromotionController extends BaseController {
  constructor() {
    super(new BaseRepository(Promotion), "khuyến mãi", {
      editableFields: [
        "title",
        "description",
        "highlight",
        "condition",
        "validUntil",
        "status",
        "featured",
        "displayOrder",
      ],
      searchFields: ["title", "description", "highlight", "condition"],
      defaultSort: { featured: -1, displayOrder: 1, createdAt: -1 },
    });

    // Bind method riêng
    this.getPublicPromotions = this.getPublicPromotions.bind(this);
  }

  /** Override: Thêm logic ép displayOrder thành Number */
  buildPayload(body) {
    const payload = super.buildPayload(body);

    if (Object.prototype.hasOwnProperty.call(payload, "displayOrder")) {
      payload.displayOrder = Number(payload.displayOrder) || 0;
    }

    return payload;
  }

  /**
   * GET /public — Lấy danh sách khuyến mãi đang hoạt động (Public, không cần auth).
   * Lọc theo status "Đang áp dụng" và chưa hết hạn.
   */
  async getPublicPromotions(req, res, next) {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const limit = Math.min(Number(req.query.limit) || 3, 12);

      const promotions = await this.repository.findAllWithLimit(
        {
          status: "Đang áp dụng",
          $or: [{ validUntil: "" }, { validUntil: { $gte: today } }],
        },
        this.defaultSort,
        limit
      );

      res.json({ success: true, count: promotions.length, data: promotions });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PromotionController();
