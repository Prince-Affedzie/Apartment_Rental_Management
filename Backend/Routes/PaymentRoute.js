const express = require('express')
const paymentRouter = express.Router()
const { addPayment,modifyPayment,deletePayment,getAllPayments,getPayment} = require('../Controllers/PaymentController')

paymentRouter.post('/apartment/add_payment', addPayment)
paymentRouter.put('/apartment/edit_payment/:Id',modifyPayment)
paymentRouter.delete('/apartment/delete_payment/:Id',deletePayment)
paymentRouter.get('/apartment/all_payments',getAllPayments)
paymentRouter.get('/apartment/get_payment/:Id',getPayment)

module.exports ={paymentRouter}