const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase: true,
        trim: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['Admin','Manager','Staff'],
        required:true
    },
    phone:{
        type: String
    }
})

const User = mongoose.model('User',userSchema)
module.exports = {User}