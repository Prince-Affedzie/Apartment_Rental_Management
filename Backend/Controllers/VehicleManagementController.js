const {Vehicle} = require('../Models/Vehicles')
const {CarMaintenance} =require('../Models/CarMaintenance')
//const { Apartment } = require ('../Models/Apartments')

const addVehicleRecord =async(req,res)=>{
    try{
        const { vehicleType, make, model,vehicleRegNum, chassisNum, driverName,contactDetails,
            licenseNum,licenseType, licenseNumExp,maintenanceHist
        } = req.body

        console.log(req.body)
        const record = new Vehicle({
            vehiceType: vehicleType,
            make:make,
            model:model,
            vehicleRegNum:vehicleRegNum,
            chassisNum:chassisNum,
            driverName:driverName,
            contactDetails:contactDetails,
            licenseNum:licenseNum,
            licenseType:licenseType,
            licenseNumExp: licenseNumExp,
            maintenanceHist:maintenanceHist
        })
        await record.save()
        res.status(200).json({message:"Record Created Successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal Server Error'})
    }
}

const editVehicleRecord = async(req,res)=>{
    try{
        const {Id} = req.params
        const update = req.body
        console.log(update)
        console.log(update)

        const record = await Vehicle.findById(Id)
        if(!record){
            return res.status(404).json({message:'No Record Found'})
        }
        Object.assign(record,update)
        await record.save()
        res.status(200).json({message: "Record Updated Successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const deleteVehicleRecord = async(req,res)=>{
    try{
        const {Id} = req.params
        const record = await Vehicle.findById(Id)
        if(!record){
            return res.status(404).json({message:'No Record Found'})
        }
        await record.deleteOne()
        res.status(200).json({message:"Record removed successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getVehicleRecords = async(req,res)=>{
    try{
        const vehicles = await Vehicle.find().sort({createdAt:-1})
        res.status(200).json(vehicles)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getVehicleRecord = async(req,res)=>{
    try{
        const {Id} = req.params
        const vehicle = await Vehicle.findById(Id)
        if(!vehicle){
            return res.status(404).json({message:"No Vehicle Found"})
        }
        res.status(200).json(vehicle)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const addMaintenanceRecord =async(req,res)=>{
    try{
        
        const {vehicleId, maintenanceDate,cost, issue,status
        } = req.body

        const vehicle  = await Vehicle.findById(vehicleId)

        console.log(req.body)
        const record = new CarMaintenance({
            vehicleId:vehicle._id,
            maintenanceDate: maintenanceDate,
            cost:cost,
            issue: issue,
            status:status
        })
        const maintenanceHist = {
            hist : issue,
            date: maintenanceDate,
            cost: cost,
            status: status
        }
        vehicle.maintenanceHist.push(maintenanceHist)
        await record.save()
        await  vehicle.save()
        res.status(200).json({message:"Record Created Successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal Server Error'})
    }
}

const editMaintenanceRecord = async(req,res)=>{
    try{
        const {Id} = req.params
        const update = req.body
        console.log(update)
        console.log(update)

        const record = await CarMaintenance.findById(Id)
        if(!record){
            return res.status(404).json({message:'No Record Found'})
        }
        Object.assign(record,update)
        await record.save()
        res.status(200).json({message: "Record Updated Successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const deleteMaintenanceRecord = async(req,res)=>{
    try{
        const {Id} = req.params
        const record = await CarMaintenance.findById(Id)
        if(!record){
            return res.status(404).json({message:'No Record Found'})
        }
        await record.deleteOne()
        res.status(200).json({message:"Record removed successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getMaintenanceRecords = async(req,res)=>{
    try{
        const vehicles = await CarMaintenance.find().populate('vehicleId').sort({createdAt:-1})
        res.status(200).json(vehicles)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getMaintenanceRecord = async(req,res)=>{
    try{
        const {Id} = req.params
        const vehicle = await CarMaintenance.findById(Id).populate('vehicleId')
        if(!vehicle){
            return res.status(404).json({message:"No Vehicle Found"})
        }
        res.status(200).json(vehicle)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}




module.exports = { addVehicleRecord,editVehicleRecord,deleteVehicleRecord, deleteMaintenanceRecord,getMaintenanceRecord,
    getVehicleRecords,getVehicleRecord,addMaintenanceRecord,editMaintenanceRecord, getMaintenanceRecords,}