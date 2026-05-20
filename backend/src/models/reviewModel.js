const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
    source: {
      type: String,
      default: "Website",
      trim: true,
    },
    text: {
      type: String,
      required: [true, "Review content is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Mới", "Đã phản hồi", "Đã ẩn"],
      default: "Mới",
    },
    reply: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
