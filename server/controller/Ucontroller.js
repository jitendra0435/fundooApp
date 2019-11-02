require('dotenv').config();
const mail = require('../util/mail');
const service=require('../services/userservice') 
class User
{
    register(req,res)
    {
        req.check('email','Invalid email').isEmail();
        req.check('password','Invalid password').isLength({ min: 6 }).isAlphanumeric();
        const errors = req.validationErrors();
        service.register(req.body,(err,data)=>
       {
         if(err)
         {
           console.log("registration failed");
           res.status(422).send(err);
         }
         else
         {
             console.log("registration successful");
             res.status(200).send(data);
         }
       })
       

    }
}
 module.exports=new User();
