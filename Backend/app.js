const express = require('express')
const BodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const { Apartment } = require ('./Models/Apartments')
const {Tenants} = require('./Models/Tenants')


const {userRouter} = require('./Routes/UserRoutes')
const {apartmentRouter} = require('./Routes/TenantsRoutes')
const {paymentRouter} = require('./Routes/PaymentRoute')
const {vehicleRoute} = require('./Routes/VehicleRoutes')
const {driverRouter} = require('./Routes/DriverRoute')
const {contractRouter} = require('./Routes/ContractsRoute')
const {contractPaymentRouter} = require('./Routes/ContractPaymentRoute')
require('dotenv').config()
const startRentNotifier = require('./Utils/rentNotifier');


startRentNotifier();


 const runMigrations = async () => {
    try {
      await Tenants.updateMany(
        {}, 
        { $set: {apartment: null } }
      );
      console.log('All users updated with default verification status');
    } catch (err) {
      console.error('Error during migration:', err);
    }
  };


const app = express()
app.use(BodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.json())
app.set('trust proxy', 1);

//https://orange-winner-q7vw64jp5gjq246qw-3000.app.github.dev/
    // https://www.trackingproperty.com
    // http://localhost:3000

app.use(cors({
  origin: [process.env.Frontend_Url, process.env.Frontend_Url_Demo],
  credentials: true
}));

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
app.use('/api',driverRouter)
app.use('/api',contractRouter)
app.use('/api',contractPaymentRouter)
