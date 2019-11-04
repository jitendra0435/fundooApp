require('dotenv').config();
var nodemailer = require('nodemailer');
let jwt = require('jsonwebtoken');

sendLink = (url,body) =>
{
  console.log(body.email);
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
    to: body.email,
    subject: 'Regestration Succesfull',
    text: 'Click on the link.\n'+url
  };
  console.log(body.email);
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
  let token = jwt.sign(payload, 'secret',{ expiresIn: '24h'});
  return token;
}

module.exports={
  sendLink,
  generateToken
}