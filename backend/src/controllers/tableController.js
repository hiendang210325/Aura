const asyncHandler = require("express-async-handler");
const createHttpError = require("http-errors");
const Table = require("../models/tableModel");

/**
 * getTables: Lấy danh sách toàn bộ bàn
 */
const getTables = asyncHandler(async (req, res, next) => {
  const filter = {};
  if (req.query.area) {
    filter.area = req.query.area;
  }

  const tables = await Table.find(filter).sort({ tableId: 1 });

  res.status(200).json({
    success: true,
    count: tables.length,
    data: tables,
  });
});

/**
 * createTable: Thêm bàn mới
 */
const createTable = asyncHandler(async (req, res, next) => {
  const { tableId, area, capacity, status } = req.body;

  if (!tableId || !area || !capacity) {
    throw createHttpError(400, "Please provide tableId, area, and capacity");
  }

  // Check if table already exists
  const existingTable = await Table.findOne({ tableId });
  if (existingTable) {
    throw createHttpError(400, "Table ID already exists");
  }

  const table = await Table.create({
    tableId,
    area,
    capacity,
    status: status || "Còn trống"
  });

  res.status(201).json({
    success: true,
    data: table,
  });
});

/**
 * updateTable: Cập nhật thông tin bàn
 */
const updateTable = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let table = await Table.findById(id);

  if (!table) {
    throw createHttpError(404, "Table not found");
  }

  table = await Table.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: table,
  });
});

/**
 * deleteTable: Xóa bàn
 */
const deleteTable = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const table = await Table.findById(id);

  if (!table) {
    throw createHttpError(404, "Table not found");
  }

  await table.deleteOne();

  res.status(200).json({
    success: true,
    message: "Table removed successfully",
  });
});

module.exports = {
  getTables,
  createTable,
  updateTable,
  deleteTable,
};
