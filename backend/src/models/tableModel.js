const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    tableId: {
      type: String,
      required: [true, 'Please provide a table ID (e.g., M-01)'],
      unique: true,
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Please assign an area'],
      enum: ['Sảnh chính', 'Phòng VIP', 'Khu gia đình', 'Khu ngoài trời', 'Khu sự kiện']
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide capacity'],
      min: [1, 'Capacity must be at least 1']
    },
    status: {
      type: String,
      enum: ['Còn trống', 'Có khách', 'Đã đặt', 'Đang dọn'],
      default: 'Còn trống'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Table', tableSchema);
