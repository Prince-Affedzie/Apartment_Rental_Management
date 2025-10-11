const { ContractPayment } = require("../Models/ContractPayments");
const { Contract } = require("../Models/ContractSchema");

// Record a Payment
const createPayment = async (req, res) => {
  try {
    const paymentData = {
      ...req.body,
      userId: req.userId,
    };

    const payment = await ContractPayment.create(paymentData);

    // Update Contract balance when payment is added
    const contractToUpdate = await Contract.findOne({
      _id: req.body.contractId,
      userId: req.userId,
    });

    if (!contractToUpdate) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const totalPaymentMadeUpdated =
      contractToUpdate.totalAmountPaid + payment.amount;
    const balanceLeft =
      contractToUpdate.expectedTotalPaymentAmount - totalPaymentMadeUpdated;

    contractToUpdate.totalAmountPaid = totalPaymentMadeUpdated;
    contractToUpdate.balanceLeft = balanceLeft;

    await contractToUpdate.save();

    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Payments
const getPayments = async (req, res) => {
  try {
    const payments = await ContractPayment.find({ userId: req.userId })
      .populate("contractId")
      .populate("driverId", "firstName lastName");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Payment
const getPaymentById = async (req, res) => {
  try {
    const payment = await ContractPayment.findOne({
      _id: req.params.id,
      userId: req.userId,
    })
      .populate("contractId")
      .populate("driverId", "firstName lastName");

    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Payment
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(req.body);
    const payment = await ContractPayment.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    const contractToUpdate = await Contract.findOne({
      _id: req.body.contractId,
      userId: req.userId,
    });

    if (!contractToUpdate) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // If amount is being updated, adjust contract totals
    if (req.body.amount && req.body.amount !== payment.amount) {
      const oldAmount = payment.amount;
      const newAmount = req.body.amount;

      // Update contract totals
      contractToUpdate.totalAmountPaid =
        contractToUpdate.totalAmountPaid - oldAmount + newAmount;

      contractToUpdate.balanceLeft =
        contractToUpdate.expectedTotalPaymentAmount -
        contractToUpdate.totalAmountPaid;

      await contractToUpdate.save();
    }

    Object.assign(payment, req.body);
    await payment.save();
    res.status(200).json({ message: "Contract Payment Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// Delete Payment
const deletePayment = async (req, res) => {
  try {
    const payment = await ContractPayment.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentById,
  getPayments,
};
