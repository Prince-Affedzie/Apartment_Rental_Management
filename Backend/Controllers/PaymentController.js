const { Payment } = require("../Models/ApartmentPaymentModel");
const { Tenants } = require("../Models/Tenants");

const addPayment = async (req, res) => {
  try {
    const { tenant, amountPaid, method, status, Date } = req.body;
    const payment = new Payment({
      tenant: tenant,
      amountPaid: amountPaid,
      method: method,
      status: status,
      date: Date,
      userId: req.userId,
    });

    const tenantRecord = await Tenants.findById(tenant)
    if(!tenantRecord){
      return res.status(404).json({message: "Tenant Not Found"})
    }
    if( amountPaid >  tenantRecord.totalAmount){
      return res.status(400).json({message:"The amount you Entered is Larger than the amount expected of the tenant."})
    }
    tenantRecord.totalAmount = tenantRecord.totalAmount - amountPaid
    await payment.save();
    await  tenantRecord.save();
    res.status(200).json({ message: "Payment Added Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const modifyPayment = async (req, res) => {
  try {
    const { Id } = req.params;
    const update = req.body;

    const payment = await Payment.findOne({ _id: Id, userId: req.userId });

    if (!payment) {
      return res.status(400).json({ message: "No Payment Found" });
    }

    const tenant = await Tenants.findById(payment.tenant);
    

    
    if (req.body.amountPaid && req.body.amountPaid !== payment.amountPaid) {
      
      const oldAmountPaid = payment.amountPaid;
      const newAmountPaid = req.body.amountPaid;
      
      
      const paymentDifference = newAmountPaid - oldAmountPaid;

      
      tenant.totalAmount = tenant.totalAmount - paymentDifference;
      
     
      await tenant.save();
    }
    

   
    Object.assign(payment, update);
    await payment.save();

    res.status(200).json({ message: "Payment Modified Successfully" });
  } catch (err) {
    console.error(err); // Use console.error for better logging
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { Id } = req.params;
    const payment = await Payment.findOne({ _id: Id, userId: req.userId });
    if (!payment) {
      return res.status(400).json({ message: "No Payment Found" });
    }
    await payment.deleteOne();
    res.status(200).json({ message: "Payment Deletion Successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .populate("tenant")
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPayment = async (req, res) => {
  try {
    const { Id } = req.params;
    const payment = await Payment.findOne({
      _id: Id,
      userId: req.userId,
    }).populate("tenant");
    if (!payment) {
      return res.status(400).json({ message: "No payment Found" });
    }
    res.status(200).json(payment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addPayment,
  modifyPayment,
  deletePayment,
  getAllPayments,
  getPayment,
};
