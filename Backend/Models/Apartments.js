const mongoose = require('mongoose')
const schema = mongoose.Schema

const apartmentShema = new schema({
    title:{
        type: String
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:['Occupied','Available','Maintenance']
    }
},{timestamps:true})

const Apartment = mongoose.model('Apartment',apartmentShema)
module.exports = {Apartment}