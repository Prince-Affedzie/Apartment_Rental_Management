const { Vehicle } = require("../Models/Vehicles");
const { CarMaintenance } = require("../Models/CarMaintenance");
//const { Apartment } = require ('../Models/Apartments')

// const addVehicleRecord = async (req, res) => {
//   try {
//     const {
//       vehicleType,
//       make,
//       model,
//       vehicleRegNum,
//       chassisNum,
//       driver,
//       maintenanceHist,
//     } = req.body;

//     const record = new Vehicle({
//       vehicleType: vehicleType,
//       make: make,
//       model: model,
//       vehicleRegNum: vehicleRegNum,
//       chassisNum: chassisNum,
//       // driver: driver, -: To make it optional
//       maintenanceHist: maintenanceHist,
//       userId: req.userId,
//     });
//     // making Driver Optional
//     if (driver && driver.trim() !== "") {
//       recordData.driver = driver;
//     }

//     await record.save();
//     res.status(200).json({ message: "Record Created Successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const addVehicleRecord = async (req, res) => {
  try {
    const {
      vehicleType,
      make,
      model,
      vehicleRegNum,
      chassisNum,
      driver,
      maintenanceHist,
    } = req.body;

    const recordData = {
      vehicleType,
      make,
      model,
      vehicleRegNum,
      chassisNum,
      maintenanceHist,
      userId: req.userId,
    };

    //  Only add driver if not empty
    if (driver && driver.trim() !== "") {
      recordData.driver = driver;
    }

    const record = new Vehicle(recordData);
    await record.save();

    res.status(200).json({ message: "Record Created Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const editVehicleRecord = async (req, res) => {
//   try {
//     const { Id } = req.params;
//     const update = req.body;

//     // const record = await Vehicle.findById(Id);
//     const record = await Vehicle.findOne({ _id: Id, userId: req.userId });
//     if (!record) {
//       return res.status(404).json({ message: "No Record Found" });
//     }
//     Object.assign(record, update);
//     await record.save();
//     res.status(200).json({ message: "Record Updated Successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const editVehicleRecord = async (req, res) => {
  try {
    const { Id } = req.params;
    const update = req.body;

    // prevent invalid driver updates
    if (update.driver === "") {
      delete update.driver;
    }

    const record = await Vehicle.findOne({ _id: Id, userId: req.userId });
    if (!record) {
      return res.status(404).json({ message: "No Record Found" });
    }

    Object.assign(record, update);
    await record.save();
    res.status(200).json({ message: "Record Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteVehicleRecord = async (req, res) => {
  try {
    const { Id } = req.params;
    const record = await Vehicle.findOne({ _id: Id, userId: req.userId });
    if (!record) {
      return res.status(404).json({ message: "No Record Found" });
    }
    await record.deleteOne();
    res.status(200).json({ message: "Record removed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getVehicleRecords = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.userId })
      .populate("driver")
      .sort({ createdAt: -1 });
    console.log(vehicles);
    res.status(200).json(vehicles);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getVehicleRecord = async (req, res) => {
  try {
    const { Id } = req.params;
    const vehicle = await Vehicle.findOne({
      _id: Id,
      userId: req.userId,
    }).populate("driver");
    if (!vehicle) {
      return res.status(404).json({ message: "No Vehicle Found" });
    }
    res.status(200).json(vehicle);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Maintenance

// const addMaintenanceRecord = async (req, res) => {
//   try {
//     const { vehicleId, maintenanceDate, cost, issue, status } = req.body;

//     // const vehicle = await Vehicle.findById(vehicleId);
//     const vehicle = await Vehicle.findOne({
//       _id: vehicleId,
//       userId: req.userId,
//     });

//     const record = new CarMaintenance({
//       vehicleId: vehicle._id,
//       maintenanceDate: maintenanceDate,
//       cost: cost,
//       issue: issue,
//       status: status,
//       userId: req.userId, // Add user ID
//     });
//     const maintenanceHist = {
//       hist: issue,
//       date: maintenanceDate,
//       cost: cost,
//       status: status,
//     };
//     vehicle.maintenanceHist.push(maintenanceHist);
//     await record.save();
//     await vehicle.save();
//     res.status(200).json({ message: "Record Created Successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const addMaintenanceRecord = async (req, res) => {
  try {
    const { vehicleId, maintenanceDate, cost, issue, status } = req.body;

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      userId: req.userId,
    });

    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found or not yours" });
    }

    const record = new CarMaintenance({
      vehicleId: vehicle._id,
      maintenanceDate,
      cost,
      issue,
      status,
      userId: req.userId,
    });

    const maintenanceHist = {
      hist: issue,
      date: maintenanceDate,
      cost,
      status,
    };

    vehicle.maintenanceHist.push(maintenanceHist);

    await record.save();
    await vehicle.save();

    res.status(200).json({ message: "Record Created Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editMaintenanceRecord = async (req, res) => {
  try {
    const { Id } = req.params;
    const update = req.body;

    const record = await CarMaintenance.findOne({
      _id: Id,
      userId: req.userId,
    });
    if (!record) {
      return res.status(404).json({ message: "No Record Found" });
    }
    Object.assign(record, update);
    await record.save();
    res.status(200).json({ message: "Record Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteMaintenanceRecord = async (req, res) => {
  try {
    const { Id } = req.params;
    const record = await CarMaintenance.findOne({
      _id: Id,
      userId: req.userId,
    });
    if (!record) {
      return res.status(404).json({ message: "No Record Found" });
    }
    await record.deleteOne();
    res.status(200).json({ message: "Record removed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMaintenanceRecords = async (req, res) => {
  try {
    const vehicles = await CarMaintenance.find({ userId: req.userId })
      .populate("vehicleId")
      .sort({ createdAt: -1 });

    res.status(200).json(vehicles);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMaintenanceRecord = async (req, res) => {
  try {
    const { Id } = req.params;
    const vehicle = await CarMaintenance.findOne({
      _id: Id,
      userId: req.userId,
    }).populate("vehicleId");
    if (!vehicle) {
      return res.status(404).json({ message: "No Vehicle Found" });
    }
    res.status(200).json(vehicle);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addVehicleRecord,
  editVehicleRecord,
  deleteVehicleRecord,
  deleteMaintenanceRecord,
  getMaintenanceRecord,
  getVehicleRecords,
  getVehicleRecord,
  addMaintenanceRecord,
  editMaintenanceRecord,
  getMaintenanceRecords,
};
