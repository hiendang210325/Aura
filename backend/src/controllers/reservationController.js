const Reservation = require("../models/reservationModel");
const BaseController = require("./BaseController");
const BaseRepository = require("../repositories/BaseRepository");

/**
 * ReservationController — Kế thừa BaseController, override create và delete
 * vì logic tạo đặt bàn phức tạp hơn CRUD chuẩn (phân biệt admin vs customer).
 */
class ReservationController extends BaseController {
  constructor() {
    super(new BaseRepository(Reservation), "đặt bàn", {
      defaultSort: { createdAt: -1 },
    });

    // Bind method riêng
    this.createPublic = this.createPublic.bind(this);
  }

  /** Override: Filter theo status và date */
  buildFilter(query) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.date) filter.date = query.date;
    return filter;
  }

  /** Override: Tạo đặt bàn từ Admin (có validate thủ công, set source = "admin") */
  async create(req, res, next) {
    try {
      const { name, phone, email, date, time, guests, type, area, table, combo, notes, status } =
        req.body;

      if (!name || !phone || !date || !time || !guests) {
        res.status(400);
        return next(new Error("Please provide all required fields"));
      }

      const reservation = await this.repository.create({
        name,
        phone,
        email: email || "",
        date,
        time,
        guests,
        type: type || "Standard",
        area: area || "Sảnh chính",
        table: table || "Chưa phân",
        combo: combo || "",
        notes: notes || "",
        source: "admin",
        status: status || "Pending",
      });

      res.status(201).json({ success: true, data: reservation });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /public — Khách hàng đặt bàn từ website (không cần đăng nhập).
   * Luôn set source = "customer", table = "Chưa phân", status = "Pending".
   */
  async createPublic(req, res, next) {
    try {
      const { name, phone, email, date, time, guests, type, area, combo, notes } = req.body;

      if (!name || !phone || !date || !time || !guests) {
        res.status(400);
        return next(
          new Error("Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, SĐT, Ngày, Giờ, Số khách)")
        );
      }

      const reservation = await this.repository.create({
        name,
        phone,
        email: email || "",
        date,
        time,
        guests: Number(guests),
        type: type || "Standard",
        area: area || "Sảnh chính",
        table: "Chưa phân",
        combo: combo || "",
        notes: notes || "",
        source: "customer",
        status: "Pending",
      });

      res.status(201).json({
        success: true,
        message: "Đặt bàn thành công! Chúng tôi sẽ liên hệ xác nhận sớm nhất.",
        data: reservation,
      });
    } catch (err) {
      next(err);
    }
  }

  /** Override: Dùng findById + deleteOne thay vì findByIdAndDelete (giữ nguyên hành vi cũ) */
  async delete(req, res, next) {
    try {
      const reservation = await this.repository.findById(req.params.id);

      if (!reservation) {
        res.status(404);
        return next(new Error("Không tìm thấy đặt bàn"));
      }

      await reservation.deleteOne();

      res.json({ success: true, message: "Đã xóa đặt bàn thành công" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReservationController();
