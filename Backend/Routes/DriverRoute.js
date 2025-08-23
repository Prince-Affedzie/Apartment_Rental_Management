const express = require('express');
const driverRouter = express.Router();
const {createDriver,getDriverById,getDrivers,deleteDriver, updateDriver}
 = require('../Controllers/DriverController');

// Driver CRUD
driverRouter.post('/add_new/driver', createDriver);
driverRouter.get('/get_all_drivers', getDrivers);
driverRouter.get('/get_driver/:id', getDriverById);
driverRouter.put('/update_driver/:id', updateDriver);
driverRouter.delete('/delete_driver/:id', deleteDriver);

module.exports ={ driverRouter };
