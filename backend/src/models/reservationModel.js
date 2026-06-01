const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Please add a customer name'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
      type: String,
      required: [true, 'Please add a reservation date']
    },
    time: {
      type: String,
      required: [true, 'Please add a reservation time']
    },
    guests: {
      type: Number,
      required: [true, 'Please specify the number of guests'],
      min: [1, 'Must be at least 1 guest']
    },
    type: {
      type: String,
      enum: ['Standard', 'Combo', 'Birthday', 'Corporate'],
      default: 'Standard'
    },
    area: {
      type: String,
      default: 'Sảnh chính'
    },
    table: {
      type: String,
      default: 'Chưa phân'
    },
    combo: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'admin'
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Seated', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
