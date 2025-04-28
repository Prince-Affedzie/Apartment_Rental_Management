const mongoose = require('mongoose')
const schema = mongoose.Schema

const paymentSchema = new schema({
    tenant:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Tenants'
    },

    amountPaid:{
        type: Number
    },
    method:{
        type: String,
        enum: ['Mobile Money','Bank Transfer','Cash']
    },
    status:{
        type:String,
        enum: ['Completed','Partial']
    },
    date:{
        type: Date
    }
},{timestamps:true})

const Payment = mongoose.model('Payment',paymentSchema)
module.exports = {Payment}