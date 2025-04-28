const mongoose = require('mongoose')
const schema = mongoose.Schema

const vehicleSchema = new schema({
    vehiceType:{
        type:String,
        enum:['commercial car','luxury car','taxi','truck','bus']
    },
    make:{
        type:String
    },
    model:{
        type:String
    },
    vehicleRegNum:{
        type: String
    },
    chassisNum:{
        type: String
    },
    maintenanceHist:[{
        hist:[{type:String}],
        cost:{type:Number},
        date:{type:Date},
        status: {type: String, enum: ['ongoing','pending','completed']}
    }],
    driverName:{
        type: String
    },
    contactDetails:{
        phone:{type: String},
        location:{type:String}
    },
    licenseNum:{
        type:String
    },
    licenseType:{
      type: String,
      enum:['commercial','non-commercial']
    },
    licenseNumExp:{
     type: Date
    }
},{timestamps:true})

const Vehicle = mongoose.model('Vehicle',vehicleSchema)
module.exports ={Vehicle}