require('dotenv').config();
const mail = require('../util/mail');
const service = require('../services/userservice')
class User {
  register(req, res) {
    req.check('email', 'Invalid email').isEmail();
    req.check('password', 'Invalid password').isLength({ min: 6 }).isAlphanumeric();
    const errors = req.validationErrors();
    service.register(req.body, (err, data) => {
      if (err) {
        console.log("registration failed");
        res.status(422).send(err);
      }
      else {
        console.log("registration successful");
        res.status(200).send(data);
      }
    })


  }
  login(req, res) {
    req.check('email', 'Invalid email').isEmail();
    req.check('password', 'Invalid password').isLength({ min: 6 }).isAlphanumeric();
    const errors = req.validationErrors()
    if (errors){
      res.status(422).json({ errors: errors })}
      
        service.login(req.body, (err, data) => {
          if (err) {
            console.log("login failed");
            res.status(422).send(err);
          }
          else
            console.log(" login successful");
          res.status(200).send(data);
        })
  }


varifyEmail(req,res)
{
  service.varifyEmail(req.body,(err,data)=>{
    if(err)
     res.status(422).send(err);
     else
     res.status(200).send(data);
  })
}
}
module.exports = new User();
