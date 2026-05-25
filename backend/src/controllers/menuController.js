const MenuItem = require("../models/menuItemModel");
const BaseController = require("./BaseController");
const BaseRepository = require("../repositories/BaseRepository");

/**
 * MenuController — Kế thừa BaseController, override buildFilter
 * để thêm filter theo category.
 */
class MenuController extends BaseController {
  constructor() {
    super(new BaseRepository(MenuItem), "món ăn", {
      editableFields: [
        "name",
        "category",
        "price",
        "description",
        "image",
        "status",
        "featured",
      ],
      defaultSort: { createdAt: -1 },
    });
  }

  /** Override: Thêm filter theo category */
  buildFilter(query) {
    const filter = {};
    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    return filter;
  }
}

module.exports = new MenuController();
