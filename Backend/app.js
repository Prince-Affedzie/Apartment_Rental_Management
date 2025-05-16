const express = require('express')
const BodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const {userRouter} = require('./Routes/UserRoutes')
const {apartmentRouter} = require('./Routes/TenantsRoutes')
const {paymentRouter} = require('./Routes/PaymentRoute')
const {vehicleRoute} = require('./Routes/VehicleRoutes')
require('dotenv').config()
const startRentNotifier = require('./Utils/rentNotifier');


startRentNotifier();


const app = express()
app.use(BodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.json())
app.set('trust proxy', 1);

app.use(cors({
    origin:"https://www.trackingproperty.com",
    credentials:true
}))
app.use('/uploads',express.static('uploads'))
mongoose.connect(process.env.DATABase_URL)
     .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log(`Listening on Port  ${process.env.PORT}`)
            startRentNotifier();
        })
     })
     .catch((err)=>{
        console.log(err)
     })



app.use('/api',userRouter)
app.use('/api',apartmentRouter)
app.use('/api',paymentRouter)
app.use('/api',vehicleRoute)
