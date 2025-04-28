const {body,query,params,validationResult} =require('express-validator')
const { isLength } = require('validator')

const validateInput =[
    body('email')
       .isEmail().withMessage("Invalid Email Format")
       .normalizeEmail(),

    body('name')
       .trim()
       .escape(),

    body('password')
       .isLength({min:8}).withMessage("Password Must be at least 8 characters")
       .matches(/\d/).withMessage("Password should at least contain a number")
       .matches(/[A-Z]/).withMessage("Password should contain at least One Upper case Letter"),

    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({status:'error',
                message:'Validation Failed',
                errors:errors.array().map((err)=>({
                    field: err.param,
                    message:err.message
                })
                )
            })
        }
        next()
    }
]

module.exports = {validateInput}