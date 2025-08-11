const {signUp,login,addNewUser,modifyUser,removeUser,getPersonalInfo,getUsers,logout} = require('../Controllers/UserController')
const {validateInput} = require('../middleware/ValidateInput')
const {verifyToken} = require('../middleware/Authentication')
const express = require('express')
const userRouter = express.Router()

userRouter.post('/login',validateInput,login)
userRouter.post('/sign_up',validateInput, signUp)
userRouter.post('/add/new_user',validateInput,addNewUser)
userRouter.put('/modify/user/',modifyUser)
userRouter.delete('/delete/user/:Id',removeUser)
userRouter.get('/view/profile_info',verifyToken,getPersonalInfo)
userRouter.get('/get/all_users',getUsers)
userRouter.post('/logout',verifyToken,logout)

module.exports = {userRouter}

