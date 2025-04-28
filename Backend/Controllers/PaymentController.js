const {Payment} = require('../Models/ApartmentPaymentModel')

const addPayment = async(req,res)=>{
    try{
        console.log(req.body)
        const {tenant,amountPaid,method,status, Date} =req.body
        const payment = new Payment({
            tenant:tenant,
            amountPaid:amountPaid,
            method:method,
            status:status,
            date:Date

        })
        await payment.save()
        res.status(200).json({message:"Payment Added Successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const modifyPayment = async(req,res)=>{
    try{
        const {Id} =req.params
        const update = req.body
        const payment = await Payment.findById(Id)
        if(!payment){
            return res.status(400).json({message:"No Payment Found"})
        }
        Object.assign(payment,update)
        await payment.save()
        res.status(200).json({message:"Payment Modified Successfully"})


    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const deletePayment =async(req,res)=>{
    try{
        const {Id} =req.params
        const payment = await Payment.findById(Id)
        if(!payment){
            return res.status(400).json({message:"No Payment Found"})
        }
        await payment.deleteOne()
        res.status(200).json({message:"Payment Deletion Successful"})

    }catch(err){
        res.status(500).json({message:"Internal server Error"})
    }
}

const getAllPayments = async(req,res)=>{
    try{
        const payments = await Payment.find().populate('tenant').sort({createdAt:-1})
        res.status(200).json(payments)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}


const getPayment = async(req,res)=>{

    try{
        const {Id} = req.params
        const payment = await Payment.findById(Id).populate('tenant')
        if(!payment){
            return res.status(400).json({message:"No payment Found"})
        }
        res.status(200).json(payment)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = { addPayment,modifyPayment,deletePayment,getAllPayments,getPayment}