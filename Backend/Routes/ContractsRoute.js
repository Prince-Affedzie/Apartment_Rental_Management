const  {createContract,updateContract,deleteContract,getContractById,getContracts} = require('../Controllers/ContractController')
const express = require('express');
const contractRouter = express.Router();

// Contract CRUD
contractRouter.post('/create_contract',createContract);
contractRouter.get('/get_all_contracts', getContracts);
contractRouter.get('/get_contract/:id',getContractById);
contractRouter.put('/update_contract/:id',updateContract);
contractRouter.delete('/delete_contract/:id', deleteContract);

// Extra: Get contracts by driverId
//router.get('/driver/:driverId', contractController.getContractsByDriver);

module.exports = {contractRouter};

