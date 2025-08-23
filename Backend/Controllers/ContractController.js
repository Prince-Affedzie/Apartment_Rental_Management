const { Contract } = require('../Models/ContractSchema');
const { Driver } = require('../Models/DriverModel');

// Create Contract
const createContract = async (req, res) => {
  try {
    const contract = await Contract.create(req.body);
    res.status(201).json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Contracts
const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find()
      .populate("driverId", "firstName lastName phone")
      .populate("vehicleId");
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Contract
const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate("driverId", "firstName lastName phone")
      .populate("vehicleId");
    if (!contract) return res.status(404).json({ error: "Contract not found" });
    res.json(contract);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Contract
const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contract) return res.status(404).json({ error: "Contract not found" });
    res.json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Contract
const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) return res.status(404).json({ error: "Contract not found" });
    res.json({ message: "Contract deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {createContract,updateContract,deleteContract,getContractById,getContracts}
