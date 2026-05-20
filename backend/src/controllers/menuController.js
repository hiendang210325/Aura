const MenuItem = require("../models/menuItemModel");

// @desc    Lấy danh sách tất cả món ăn (có thể lọc theo category, status)
// @route   GET /api/v1/menu
// @access  Private
const getMenuItems = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status)   filter.status   = req.query.status;

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

// @desc    Lấy chi tiết 1 món ăn
// @route   GET /api/v1/menu/:id
// @access  Private
const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      return next(new Error("Không tìm thấy món ăn"));
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// @desc    Thêm mới món ăn
// @route   POST /api/v1/menu
// @access  Private/Admin
const createMenuItem = async (req, res, next) => {
  try {
    const { name, category, price, description, image, status, featured } = req.body;
    const item = await MenuItem.create({
      name, category, price, description, image, status, featured,
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// @desc    Cập nhật toàn bộ thông tin món ăn (dùng cho Edit)
// @route   PUT /api/v1/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404);
      return next(new Error("Không tìm thấy món ăn"));
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// @desc    Cập nhật nhanh trạng thái (Còn hàng / Hết hàng / Tạm ngưng)
// @route   PATCH /api/v1/menu/:id/status
// @access  Private/Admin
const updateMenuItemStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404);
      return next(new Error("Không tìm thấy món ăn"));
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// @desc    Xóa món ăn
// @route   DELETE /api/v1/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404);
      return next(new Error("Không tìm thấy món ăn"));
    }
    res.json({ success: true, message: "Đã xóa món ăn thành công" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  updateMenuItemStatus,
  deleteMenuItem,
};
