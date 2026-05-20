const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "restaurant",
    },
    restaurantName: {
      type: String,
      required: true,
      trim: true,
      default: "AURA Luxury Dining",
    },
    category: {
      type: String,
      trim: true,
      default: "Nhà hàng Cao cấp / Quốc tế",
    },
    address: {
      type: String,
      trim: true,
      default: "123 Luxury Avenue, District 1, Ho Chi Minh City",
    },
    description: {
      type: String,
      trim: true,
      default:
        "Trải nghiệm ẩm thực độc quyền kết hợp nghệ thuật ẩm thực hiện đại với sự thanh lịch cổ điển.",
    },
    phone: {
      type: String,
      trim: true,
      default: "+84 28 3822 0000",
    },
    email: {
      type: String,
      trim: true,
      default: "reservations@aura-dining.com",
    },
    weekdayHours: {
      type: String,
      trim: true,
      default: "17:00 - 23:00",
    },
    weekendHours: {
      type: String,
      trim: true,
      default: "11:00 - 23:30",
    },
    maxAdvanceBookingDays: {
      type: Number,
      min: 1,
      default: 30,
    },
    cancelBeforeHours: {
      type: Number,
      min: 0,
      default: 24,
    },
    depositPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 30,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
