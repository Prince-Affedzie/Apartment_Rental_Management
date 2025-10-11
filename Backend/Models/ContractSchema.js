const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "completed", "terminated"],
    default: "active",
  },
  paymentTerms: {
    type: String,
    required: true,
  },
  // This could be a fixed amount, percentage of sales, etc.
  paymentAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true,
  },
  expectedTotalPaymentAmount: {
    type: Number,
  },
  totalAmountPaid: {
    type: Number,
    default: 0,
  },
  balanceLeft: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Contract = mongoose.model("Contract", contractSchema);
module.exports = { Contract };
