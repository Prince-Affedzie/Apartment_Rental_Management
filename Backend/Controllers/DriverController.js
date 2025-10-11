const { Driver } = require("../Models/DriverModel");

// Create Driver
const createDriver = async (req, res) => {
  try {
    console.log(req.body);
    const driverData = {
      ...req.body,
      userId: req.userId,
    };
    const driver = await Driver.create(driverData);
    res.status(201).json(driver);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// Get All Drivers
const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ userId: req.userId });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Driver
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Driver
const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Driver
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createDriver,
  getDriverById,
  getDrivers,
  deleteDriver,
  updateDriver,
};
