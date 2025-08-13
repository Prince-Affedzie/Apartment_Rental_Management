const {User} = require('../Models/Users')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const signUp = async(req,res)=>{
    try{
        const {email,password,name,role} = req.body
        const isEmail = validator.isEmail(email)
       
        if(!isEmail){
            return res.status(400).json({message:"Invalid Email"})
        }
        const userExist = await User.findOne({email:email})
        if (userExist){
            return res.status(400).json({message: "User Already Exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            name,
            email,
            password:hashedPassword,
            role
        })

        await user.save()
        const token = jwt.sign({id:user._id,role:user.role},process.env.token)
       
        res.cookie('token',token,{httpOnly:true,secure:true,sameSite: 'None'})
        res.status(200).json({message:"User Created Successfully"});


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const login = async(req,res)=>{
    try{
        console.log(req.body)
        const {email,password} =req.body
        if(!email || !password){
            return res.status(400).json({message:"All Fields Are Required"})
        }
        const user = await User.findOne({email:email})
        

        if(!user){
            return res.status(404).json({message:"User Account not found"})
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password)
       /* if(!isPasswordMatch){
            return res.status(400).json({message:"Invalid Username or Password"})
        }*/

        const token = jwt.sign({id:user._id,role:user.role},process.env.token)
       
        res.cookie('token',token,{httpOnly:true,secure:true,sameSite: 'None'})

        res.status(200).json({message:"Login Successful"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}
//process.env.NODE_ENV === 'production'

const addNewUser = async(req,res)=>{
    try{
        const {name,email,phone,password,role} =req.body
        if(!name || !email || ! password || !role){
            return res.status(400).json({message:"All fields are required"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Invalid Email"})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new User({
            name: name,
            email:email,
            password: hashedPassword,
            role:role,
            phone:phone
        })
        await newUser.save()
        return res.status(200).json({message:"User Created Successfully"})


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}


const modifyUser = async(req,res)=>{
    try{
        
        const id = req.body._id || req.body.id
        const {name,email,phone,role,password} = req.body
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({message:"No User Found"})
        }
        if(password){
            const hashedPassword = await bcrypt.hash(password,8)
            user.password = hashedPassword
        }
        user.name = name || user.name
        user.email = email || user.email
        user.phone = phone || user.phone
        user.role = role || user.role
        await user.save()
        res.status(200).json({message:"User Details Modified Successfullyu"})


    }catch(err){
        console.log(err)
        res.status(500).json({message:" Internal Server Error"})
    }
}

const removeUser =async(req,res)=>{
    try{
        const {Id} = req.params
        const user = await User.findById(Id)
        if(!user){
            return res.status(400).json({message:"No User Found"})
        }
        await user.deleteOne()
        res.status(200).json({message:'User removal successful'})


    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal Server Error'})
        
    }
}

const getPersonalInfo = async(req,res)=>{
    try{
        const {id} = req.user
        const user = await User.findById(id)
        if(!user){
            return res.status(400).json({message:"User not Found"})
        }
        res.status(200).json(user)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getUsers = async(req,res)=>{
    try{

        const users = await User.find()
        res.status(200).json(users)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const logout = async(req,res)=>{
    try{
        const token = req.cookies.token
        await res.clearCookie(token,{httpOnly:true,sameSite:'strict',secure:false})
        res.status(200).json({message:"Logout Successful"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {signUp,login,addNewUser,modifyUser,removeUser,getPersonalInfo,getUsers,logout}