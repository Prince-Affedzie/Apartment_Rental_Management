const {Tenants} = require('../Models/Tenants')
const { Apartment } = require ('../Models/Apartments')

const addRentRecord =async(req,res)=>{
    try{
        const {tenantName,tenantPhone,roomDescription,rentedDate,expirationDate,noOfMonthsRented,amountPaidOnUtility,
            monthlyPrice,totalAmount,status
        } = req.body

        const record = new Tenants({
            tenantName:tenantName,
            tenantPhone:tenantPhone,
            roomDescription:roomDescription,
            rentedDate:rentedDate,
            expirationDate:expirationDate,
            noOfMonthsRented:noOfMonthsRented,
            amountPaidOnUtility:amountPaidOnUtility,
            monthlyPrice: monthlyPrice,
            totalAmount:totalAmount,
            status:status
        })
        await record.save()
        res.status(200).json({message:"Record Created Successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal Server Error'})
    }
}

const editRecord = async(req,res)=>{
    try{
        const {Id} = req.params
        const update = req.body
        console.log(update)

        const record = await Tenants.findById(Id)
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

const deleteRecord = async(req,res)=>{
    try{
        const {Id} = req.params
        const record = await Tenants.findById(Id)
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

const getRentRecords = async(req,res)=>{
    try{
        const rents = await Tenants.find().sort({createdAt:-1})
        res.status(200).json(rents)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getRentRecord = async(req,res)=>{
    try{
        const {Id} = req.params
        const rent = await Tenants.findById(Id)
        if(!rent){
            return res.status(404).json({message:"No Rent Found"})
        }
        res.status(200).json(rent)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const addApartment = async(req,res)=>{
    try{
        console.log(req.body)
       const {title,price,location,description,status} = req.body
       const property = new Apartment({
        title : title,
        price : price,
        location: location,
        description:description,
        status: status

       })
       await property.save()
       res.status(200).json({message:"Apartment Added Successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const fetchApartmentProperties = async(req,res)=>{
    try{
        const apartments = await Apartment.find().sort({createdAt:-1})
        res.status(200).json(apartments)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const editProperty = async(req,res) => {
    try{
        const {Id} = req.params
        const update = req.body
        const property = await Apartment.findById(Id)
        if(!property){
            return res.status(404).json({message:"Property Not Found"})
        }
        Object.assign(property,update)
        await property.save()
        res.status(200).json({message:'Property Updated Successfully'})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const deleteProperty = async(req,res)=>{
    try{
        const {Id} =req.params
        const property = await Apartment.findById(Id)
        if(!property){
            return res.status(400).json({message:"No Property Found"})
        }
        await property.deleteOne()
        res.status(200).json({message:"No Property Found"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getApartment = async(req,res)=>{
    try{
        const {Id} = req.params
        const apartment = await Apartment.findById(Id)
        if(!apartment){
            return res.status(400).json({message:"No Apartment Found"})
        }
        res.status(200).json( apartment)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"No Apartment Found"})
    }
}

module.exports = {addRentRecord,editRecord,deleteRecord,getRentRecords,getRentRecord,addApartment,
    fetchApartmentProperties,editProperty,deleteProperty ,getApartment}