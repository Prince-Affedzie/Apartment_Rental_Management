const mongoose = require('mongoose')
const schema  = mongoose.Schema

const tenantsSchema = new schema({
    tenantName:{
        type:String,
        required:true
    },
    tenantPhone:{
        type:String,
        required:true
    },
    roomDescription:{
        type: String,
        required:true
    },
    rentedDate:{
        type: Date
    },
    expirationDate:{
        type: Date
    },
    noOfMonthsRented:{
        type: Number
    },
    amountPaidOnUtility:{
        type: Number
    },
    monthlyPrice:{
        type: Number
    },
    status:{
        type: String,
        enum:['Active','Inactive']
    },
    totalAmount:{
        type:Number
    }
},{timestamps:true})

const Tenants = mongoose.model('Tenants',tenantsSchema)
module.exports = {Tenants}