const asyncHandler = require("express-async-handler");
const createHttpError = require("http-errors");
const Reservation = require("../models/reservationModel");

/**
 * getReservations: Lấy danh sách (Có thể tích hợp thêm filter theo status).
 */
const getReservations = asyncHandler(async (req, res, next) => {
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  // Nếu query theo date
  if (req.query.date) {
    filter.date = req.query.date;
  }

  // Sắp xếp mới nhất lên đầu
  const reservations = await Reservation.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations,
  });
});

/**
 * createReservation: Thêm mới đặt bàn (Admin).
 */
const createReservation = asyncHandler(async (req, res, next) => {
  const { name, phone, email, date, time, guests, type, area, table, combo, notes, status } = req.body;

  if (!name || !phone || !date || !time || !guests) {
    throw createHttpError(400, "Please provide all required fields");
  }

  const reservation = await Reservation.create({
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

  res.status(201).json({
    success: true,
    data: reservation,
  });
});

/**
 * createPublicReservation: Khách hàng đặt bàn từ website (không cần đăng nhập).
 */
const createPublicReservation = asyncHandler(async (req, res, next) => {
  const { name, phone, email, date, time, guests, type, area, combo, notes } = req.body;

  // Validate các trường bắt buộc
  if (!name || !phone || !date || !time || !guests) {
    throw createHttpError(400, "Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, SĐT, Ngày, Giờ, Số khách)");
  }

  const reservation = await Reservation.create({
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
});

/**
 * updateReservation: Cập nhật toàn bộ thông tin (dùng cho Edit).
 */
const updateReservation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let reservation = await Reservation.findById(id);

  if (!reservation) {
    throw createHttpError(404, "Reservation not found");
  }

  reservation = await Reservation.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: reservation,
  });
});

/**
 * updateReservationStatus: Cập nhật nhanh trạng thái (Dành cho nút Check, X).
 */
const updateReservationStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw createHttpError(400, "Please provide a status");
  }

  let reservation = await Reservation.findById(id);

  if (!reservation) {
    throw createHttpError(404, "Reservation not found");
  }

  reservation.status = status;
  await reservation.save();

  res.status(200).json({
    success: true,
    data: reservation,
  });
});

/**
 * deleteReservation: Xóa (Dành cho nút Delete/More).
 */
const deleteReservation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const reservation = await Reservation.findById(id);

  if (!reservation) {
    throw createHttpError(404, "Reservation not found");
  }

  await reservation.deleteOne();

  res.status(200).json({
    success: true,
    message: "Reservation removed successfully",
  });
});

module.exports = {
  getReservations,
  createReservation,
  createPublicReservation,
  updateReservation,
  updateReservationStatus,
  deleteReservation,
};
