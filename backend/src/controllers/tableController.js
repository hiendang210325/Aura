const Table = require("../models/tableModel");
const BaseController = require("./BaseController");
const BaseRepository = require("../repositories/BaseRepository");

/**
 * TableController — Kế thừa BaseController, override create và delete
 * vì create cần check duplicate tableId, delete dùng findById + deleteOne.
 */
class TableController extends BaseController {
  constructor() {
    super(new BaseRepository(Table), "bàn", {
      defaultSort: { tableId: 1 },
    });
  }

  /** Override: Filter theo area */
  buildFilter(query) {
    const filter = {};
    if (query.area) filter.area = query.area;
    return filter;
  }

  /** Override: Check duplicate tableId trước khi tạo */
  async create(req, res, next) {
    try {
      const { tableId, area, capacity, status } = req.body;

      if (!tableId || !area || !capacity) {
        res.status(400);
        return next(new Error("Please provide tableId, area, and capacity"));
      }

      // Check if table already exists
      const existingTable = await this.repository.findOne({ tableId });
      if (existingTable) {
        res.status(400);
        return next(new Error("Table ID already exists"));
      }

      const table = await this.repository.create({
        tableId,
        area,
        capacity,
        status: status || "Còn trống",
      });

      res.status(201).json({ success: true, data: table });
    } catch (err) {
      next(err);
    }
  }

  /** Override: Dùng findById + deleteOne thay vì findByIdAndDelete (giữ nguyên hành vi cũ) */
  async delete(req, res, next) {
    try {
      const table = await this.repository.findById(req.params.id);

      if (!table) {
        res.status(404);
        return next(new Error("Không tìm thấy bàn"));
      }

      await table.deleteOne();

      res.json({ success: true, message: "Đã xóa bàn thành công" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TableController();
