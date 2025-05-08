const {login,addNewUser,modifyUser,removeUser,getPersonalInfo,getUsers,logout} = require('../Controllers/UserController')
const {validateInput} = require('../middleware/ValidateInput')
const {verifyToken} = require('../middleware/Authentication')
const express = require('express')
const userRouter = express.Router()

userRouter.post('/login',validateInput,login)
userRouter.post('/add/new_user',verifyToken,validateInput,addNewUser)
userRouter.put('/modify/user/',verifyToken,modifyUser)
userRouter.delete('/delete/user/:Id',verifyToken,removeUser)
userRouter.get('/view/profile_info',verifyToken,getPersonalInfo)
userRouter.get('/get/all_users',verifyToken,getUsers)
userRouter.post('/logout',verifyToken,logout)

module.exports = {userRouter}

