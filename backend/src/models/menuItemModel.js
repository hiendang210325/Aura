const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên món là bắt buộc"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Danh mục là bắt buộc"],
      enum: ["Khai vị", "Món chính", "Tráng miệng", "Đồ uống"],
    },
    // Giá lưu dạng số nguyên (VND)
    price: {
      type: Number,
      required: [true, "Giá là bắt buộc"],
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    // Ảnh lưu dạng Base64 string
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Còn hàng", "Hết hàng", "Tạm ngưng"],
      default: "Còn hàng",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
