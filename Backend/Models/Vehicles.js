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
   driver:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Driver'
   }
},{timestamps:true})

const Vehicle = mongoose.model('Vehicle',vehicleSchema)
module.exports ={Vehicle}