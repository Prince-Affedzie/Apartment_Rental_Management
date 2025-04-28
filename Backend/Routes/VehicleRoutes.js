const express = require('express')
const vehicleRoute = express.Router()
const { addVehicleRecord,editVehicleRecord,deleteVehicleRecord, getVehicleRecords,
    getVehicleRecord,addMaintenanceRecord,editMaintenanceRecord, getMaintenanceRecords,
    deleteMaintenanceRecord,getMaintenanceRecord} = require('../Controllers/VehicleManagementController')

vehicleRoute.post('/add/vehicle_record', addVehicleRecord)
vehicleRoute.put('/edit/vehicle_record/:Id',editVehicleRecord)
vehicleRoute.delete('/delete/vehicle_record/:Id',deleteVehicleRecord)
vehicleRoute.get('/get/vehicle_records',getVehicleRecords)
vehicleRoute.get('/get/vehicle_record/:Id',getVehicleRecord)
vehicleRoute.post('/add/maintenance_record',addMaintenanceRecord)
vehicleRoute.get('/get/maintenance_records',getMaintenanceRecords)
vehicleRoute.put('/edit/vehicle_maintenance/:Id',editMaintenanceRecord)
vehicleRoute.get('/get/vehicle_maintenance_record/:Id',getMaintenanceRecord)
vehicleRoute.delete('/delete/maintenance_record/:Id',deleteMaintenanceRecord)


module.exports ={vehicleRoute}