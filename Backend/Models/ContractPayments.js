const mongoose = require("mongoose");

const paymentRecordSchema = new mongoose.Schema({
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract",
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "bank_transfer", "mobile_money"],
    required: true,
  },
  reference: {
    type: String,
  },

  notes: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const ContractPayment = mongoose.model("ContractPayment", paymentRecordSchema);
module.exports = { ContractPayment };
