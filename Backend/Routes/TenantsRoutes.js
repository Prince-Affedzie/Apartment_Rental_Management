const express = require('express')
const {verifyToken} = require('../middleware/Authentication')
const  {addRentRecord,editRecord,deleteRecord,getRentRecords,getRentRecord,
    addApartment,fetchApartmentProperties,editProperty,deleteProperty,getApartment
} = require('../Controllers/TenantController')
const apartmentRouter = express.Router()

apartmentRouter.post('/create_rent/record',addRentRecord)
apartmentRouter.put('/edit/rent_record/:Id',editRecord)
apartmentRouter.delete('/delete/rent_record/:Id',deleteRecord)
apartmentRouter.get('/view/rent_records',getRentRecords)
apartmentRouter.get('/view/rent_record/:Id',getRentRecord)
apartmentRouter.post('/add/apartment_property',addApartment)
apartmentRouter.put('/edit/apartment_property/:Id',editProperty)
apartmentRouter.get('/get/apartment_properties',fetchApartmentProperties)
apartmentRouter.get('/get/apartment_property/:Id',getApartment)
apartmentRouter.delete('/delete/apartment_property/:Id',deleteProperty )

module.exports = {apartmentRouter}
