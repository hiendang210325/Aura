const Combo = require("../models/comboModel");
const BaseController = require("./BaseController");
const BaseRepository = require("../repositories/BaseRepository");

/**
 * ComboController — Kế thừa BaseController, override buildPayload
 * để xử lý normalizeDishes và ép kiểu price.
 */
class ComboController extends BaseController {
  constructor() {
    super(new BaseRepository(Combo), "combo", {
      editableFields: [
        "name",
        "description",
        "guests",
        "dishes",
        "price",
        "image",
        "status",
        "featured",
      ],
      searchFields: ["name", "description", "guests", "dishes"],
      defaultSort: { featured: -1, createdAt: -1 },
    });
  }

  /**
   * Chuẩn hóa dishes: chuyển string multi-line thành array,
   * hoặc trim từng phần tử nếu đã là array.
   */
  normalizeDishes(dishes) {
    if (Array.isArray(dishes)) {
      return dishes.map((dish) => String(dish).trim()).filter(Boolean);
    }

    if (typeof dishes === "string") {
      return dishes
        .split(/\r?\n/)
        .map((dish) => dish.trim())
        .filter(Boolean);
    }

    return [];
  }

  /** Override: Thêm logic normalizeDishes và ép kiểu price */
  buildPayload(body) {
    const payload = super.buildPayload(body);

    if (Object.prototype.hasOwnProperty.call(payload, "dishes")) {
      payload.dishes = this.normalizeDishes(payload.dishes);
    }

    if (Object.prototype.hasOwnProperty.call(payload, "price")) {
      payload.price = Number(payload.price);
    }

    return payload;
  }
}

module.exports = new ComboController();
