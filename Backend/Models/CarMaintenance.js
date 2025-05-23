const mongoose = require('mongoose')
const schema = mongoose.Schema

const carMaintenanceSchema = new schema({
    vehicleId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Vehicle'
    },
    maintenanceDate:{
       type: Date
    },
    cost:{
        type :Number
    },
    issue:[{
        type: String
    }],
    status:{
        type:String,
        enum:['ongoing','pending','completed']
    }
},{timestamps:true})

const CarMaintenance = mongoose.model('CarMaintenance',carMaintenanceSchema)
module.exports = {CarMaintenance}