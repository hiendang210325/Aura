const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Promotion title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Promotion description is required"],
      trim: true,
    },
    highlight: {
      type: String,
      required: [true, "Promotion highlight is required"],
      trim: true,
    },
    condition: {
      type: String,
      default: "",
      trim: true,
    },
    validUntil: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Đang áp dụng", "Tạm dừng"],
      default: "Đang áp dụng",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promotion", promotionSchema);
