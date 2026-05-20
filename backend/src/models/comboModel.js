const mongoose = require("mongoose");

const comboSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Combo name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    guests: {
      type: String,
      required: [true, "Guest range is required"],
      trim: true,
    },
    dishes: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one dish is required",
      },
    },
    price: {
      type: Number,
      required: [true, "Combo price is required"],
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Đang hoạt động", "Ngừng hoạt động"],
      default: "Đang hoạt động",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Combo", comboSchema);
