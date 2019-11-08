require('dotenv').config();
var nodemailer = require('nodemailer');
let jwt = require('jsonwebtoken');

sendLink = (url,body) =>
{
  console.log(body);
  console.log(url);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email_id,
      pass: process.env.password
      
    } 
  });
  let mailOptions = {
    from: 'jitupatil937@gmail.com',
    to: 'jitupatil937@gmail.com',
    subject: 'Registrtation Successful',
    text: 'Click on the link.\n'+url
  };
  //console.log(body.emailId);
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

generateToken = (payload) =>
{
  let token = jwt.sign(payload, 'secret',{ expiresIn: '30s'});
  return token;
}

module.exports={
  sendLink,
  generateToken
}