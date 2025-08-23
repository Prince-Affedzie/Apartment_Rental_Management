const {createPayment,updatePayment,deletePayment,getPaymentById,getPayments} = require('../Controllers/contractPaymentsController')

const express = require('express');
const contractPaymentRouter = express.Router();

// Payment CRUD
contractPaymentRouter.post('/create_contract_payment', createPayment);
contractPaymentRouter.get('/get_all_contract_payments', getPayments);
contractPaymentRouter.get('/get_contract_payment/:id', getPaymentById);
contractPaymentRouter.put('/update_contract_payment/:id', updatePayment);
contractPaymentRouter.delete('/delete_contract_payment/:id', deletePayment);

// Extra: Get payments by contract
//contractPaymentRouter.get('/contract/:contractId', paymentController.getPaymentsByContract);

// Extra: Get payments by driver
//contractPaymentRouter.get('/driver/:driverId', paymentController.getPaymentsByDriver);

module.exports = {contractPaymentRouter};
