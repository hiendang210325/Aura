const Reservation = require("../models/reservationModel");
const Table = require("../models/tableModel");
const BaseController = require("./BaseController");
const BaseRepository = require("../repositories/BaseRepository");
const { queueReservationConfirmationEmail } = require("../services/emailService");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));

const parseGuests = (guests) => {
  if (typeof guests === "string" && guests.endsWith("+")) {
    return Number.parseInt(guests, 10);
  }

  return Number(guests);
};

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
    this.getMine = this.getMine.bind(this);
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
      const normalizedName = String(name || "").trim();
      const normalizedPhone = String(phone || "").trim();
      const normalizedEmail = String(email || "").trim().toLowerCase();

      if (!normalizedName || !normalizedPhone || !normalizedEmail || !date || !time || !guests) {
        res.status(400);
        return next(
          new Error(
            "Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, SĐT, Email, Ngày, Giờ, Số khách)"
          )
        );
      }

      if (!isValidEmail(normalizedEmail)) {
        res.status(400);
        return next(new Error("Vui lòng nhập địa chỉ email hợp lệ"));
      }

      const guestCount = parseGuests(guests);
      if (!Number.isFinite(guestCount) || guestCount < 1) {
        res.status(400);
        return next(new Error("Vui lòng chọn số khách hợp lệ"));
      }

      const reservation = await this.repository.create({
        user: req.user?._id || null,
        name: normalizedName,
        phone: normalizedPhone,
        email: normalizedEmail,
        date,
        time,
        guests: guestCount,
        type: type || "Standard",
        area: area || "Sảnh chính",
        table: "Chưa phân",
        combo: combo || "",
        notes: notes || "",
        source: "customer",
        status: "Pending",
      });

      const emailQueued = queueReservationConfirmationEmail(reservation);

      res.status(201).json({
        success: true,
        message: emailQueued
          ? "Đặt bàn thành công! Email xác nhận đang được gửi đến địa chỉ của bạn."
          : "Đặt bàn thành công! Chúng tôi đã ghi nhận thông tin và sẽ liên hệ xác nhận sớm nhất.",
        emailQueued,
        data: reservation,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMine(req, res, next) {
    try {
      const reservations = await Reservation.find({ user: req.user._id })
        .sort({ date: -1, time: -1, createdAt: -1 })
        .limit(20);
      const tableIds = [
        ...new Set(
          reservations
            .map((reservation) => reservation.table)
            .filter((tableId) => tableId && tableId !== "ChÆ°a phÃ¢n"),
        ),
      ];
      const tables = await Table.find({ tableId: { $in: tableIds } }).lean();
      const tableById = new Map(tables.map((table) => [table.tableId, table]));
      const data = reservations.map((reservation) => {
        const payload = reservation.toObject();
        payload.tableInfo = tableById.get(reservation.table) || null;
        return payload;
      });

      res.json({
        success: true,
        count: data.length,
        data,
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
