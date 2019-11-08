require('dotenv').config();
const mail = require('../util/mail');
const service = require('../services/userservice')
const shortid = require('shortid');
//var ismail=false;
class User {
  register(req, res) {
    try {
      req.checkBody('firstName', 'Do not keep empty').notEmpty();
      req.checkBody('firstName', 'first should be string').isAlpha();

      req.checkBody('lastName', 'Do not keep empty').notEmpty();
      req.checkBody('lastName', 'first should be string').isAlpha();

      req.checkBody('emailId', 'Do not keep empty').notEmpty();
      req.checkBody('emailId', 'Enter valid email id').isEmail();

      req.checkBody('password', 'Do not keep empty').notEmpty();
      req.checkBody('password', 'password min length should 6 ').isLength({ min: 6 });
      req.checkBody('password', 'password max length should 12 ').isLength({ max: 12 });

      let error = req.validationErrors();
      let response = {};

      if (error) {
        response.success = false;
        response.error = error;
        return res.status(422).send(response);
      }
      else {
        let registerData =
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          emailId: req.body.emailId,
          password: req.body.password
        }

        /** call registration service */

        var initPromise = service.register(registerData);
        
        initPromise.then(function (data) {
          //console.log(data);
          response.success = true;
          response.data = data;
          res.status(200).send(response);
        }, function (err) {
          //console.log("err control-48--",err);
          response.success = false;
          response.result = err;
          //res.status(402).json({message:"user already registered"})
          res.status(400).send(response);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }




login(req, res) {
  req.check('emailId', 'Invalid emailId').isEmail();
  req.check('password', 'Invalid password').isLength({ min: 6 }).isAlphanumeric();
  const errors = req.validationErrors()
  if (errors) {
    res.status(422).json({ errors: errors })
  }
  service.login(req.body, (err, data) => {
    if (err) {
      console.log("login failed");
      res.status(422).send(err);
    }
    //if(ismail==false){
    // res.status(422).send({message:'cant not login'});

    //}
    else
     // console.log("090909090",data);
      res.status(200).send(data);
      console.log(" login successful");
      //res.status(200).send(data);
  })
}


varifyEmail(req, res) {
  service.varifyEmail(req.body, (err, data) => {
    if (err)
      res.status(422).send(err);
    else
      res.status(200).send(data);

  })
}

forgot(req, res) {
  req.check('emailId', 'Invalid email').isEmail();
  const errors = req.validationErrors();
  if (errors)
    return res.status(422).json({ errors: errors });

  service.forgot(req.body, (err, data) => {
    if (err)
      res.status(422).send(err);
    else {
      let payload = { emailId: data.emailId },
        result = mail.generateToken(payload),
        req = {
          id: data._id,
          verify_token: result
        };
      service.update(req, (err, data) => {
        if (err)
          res.status(422).send(err);
        else {
          console.log(result);
          const urlshort = shortid.generate(result);
          console.log(urlshort);
          let url = 'http://localhost:3000/#!/forgot/' + urlshort;
          mail.sendLink(url, payload);
          res.status(200).send(data);
        }
      })
    }
  })
}

reset(req, res) {
  req.check('password', 'Invalid password').isLength({ min: 6 }).isAlphanumeric();
  req.check('password_new', 'Invalid password').isLength({ min: 6 }).isAlphanumeric();
  const errors = req.validationErrors();
  if (errors)
    return res.status(422).json({ errors: errors });

  let result = {
    token: req.body.token,
    password_old: req.body.password,
    password_new: req.body.password_new
  }
  service.reset(result, (err, data) => {
    if (err) {
      console.log("error in con 99--", err);

      res.status(422).send(err);
    }
    else
      res.status(200).send(data);
  })
}


getallUsers(req, res) {
  service.getallUsers(req, (err, data) => {
    if (err)
      res.status(422)(err);
    else {
      res.status(200).send(data);
    }
  })

}
}
module.exports = new User();
