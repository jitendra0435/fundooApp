
var nodemailer = require('nodemailer');
const mail = require('../util/mail');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bcrypt = require('bcrypt');
const url = 'mongodb://localhost:27017';
const shortid = require('shortid');
const validurl = require('valid-url');
const dbName = 'fundoo-App';
MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    db = client.db(dbName);
    collection = db.collection('users');
});

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    varifyEmail: {
        type: Boolean,
        default: false
    },
    forgot_token: {
        type: String,
        required: false
    },
    generated_token:{
        type:String,
        default:false

    }

});
const User = mongoose.model('user', userSchema);

class UserModel {
    register(body) {
        // console.log("body--",body);

        return new Promise(function (resolve, reject) {

            User.findOne({ emailId: body.emailId }).then(function (data) {
                // console.log("find mail--",data);
                if (!data) {
                    console.log("*******",body)
                    console.log("add new user");
                    resolve(body)
                } else {
                    console.log("user already exists");
                    reject(error, { message: 'user already exists' })
                }
            }
            ).catch(function (err) {
               reject({ message: 'user already exists' })
            })
        });
    }

    saveUser(body) {
        //console.log("save--",body);
        return new Promise(function (resolve, reject) {
            let user = new User({
                "firstName": body.firstName,
                "lastName": body.lastName,
                "emailId": body.emailId,
                "password": body.password
            });
            //console.log("======",body);
            user.save().then((data) => {
                let payload = { email: data.emailId },
                    result = mail.generateToken(payload),
                    req = {
                        id: data._id,
                        verify_token: result
                    }
                    //console.log(data);
                    //console.log(",.,.,.,.,",payload);
                    //console.log("email token:::",result)
                   //console.log(data)
                 var urlshort = shortid.generate(result);
                 //console.log("<<<<<",urlshort)
                 //console.log("8888888",req.verify_token,"9090");
                 collection.updateOne({ _id: req.id}, {$set:{ generated_token : req.verify_token}})
                 //console.log("121212",generated_token);
                 //console.log(">>>>>>>>>>",result)
                let url = 'http://localhost:3000/#!/login/' + urlshort
                mail.sendLink(url, body)
                console.log('registration successful--');
               resolve(data);
            }).catch((err) => {
                reject(err)
            })
        })

    }


    login(body, callback) {
        collection.findOne({ emailId: body.emailId }, (err, result) => {
            if (err)
                callback(err)
            else if (!result)
                callback({ message: "User not found" })
            else {
                bcrypt.compare(body.password, result.password, (err, res) => {
                    if (err)
                        callback(err);
                    else if (res)
                        callback(null, result);
                    else {
                        console.log("Login Failed");
                        callback({ message: "Wrong password entered" });
                    }
                })
            }
        })


    }

    varifyEmail(body, callback) {
        collection.updateOne({ emailId: body.emailId }, { $set: { varifyEmail: true } }, (err, result) => {
            if (err)
                callback(err);
            else
                callback(null, result)

        })
    }


    forgot(body, callback) {
        collection.findOne({ emailId: body.emailId }, (err, result) => {
            if (err)
                callback(err);
            else if (result)
                callback(null, result);
            else
                callback({ message: "User not found" });

        })
    }

    updateToken(body, callback) {
        collection.updateOne({ _id: body.id }, { $set: { forgot_token: body.verify_token } }, (err, result) => {
            if (err)
                callback(err);
            else if (result) {
                callback(null, result);
            }

        })
    }
    reset(body, callback) {
        collection.findOne({ forgot_token: body.token }, (err, result) => {
            if (err)
                callback(err);
            else if (result) {
                bcrypt.compare(body.password_old, result.password, (err, res) => {
                    if (err)
                        callback(err);
                    else if (res) {
                        bcrypt.hash(body.password_new, 10, (err, hash) => {
                            if (err)
                                throw err;
                            else {
                                collection.updateOne({ _id: result._id }, { $set: { password: hash } }, (error, data) => {
                                    if (error) {
                                        console.log("error", error);

                                        callback(error);
                                    }
                                    else
                                        callback(null, data);
                                    // {message:"Updated successfully"}
                                })
                            }
                        })
                    }
                    else {
                        console.log("Login Failed");
                        callback({ message: "Wrong password entered" });
                    }
                })
            }
        })
    }


    getallUsers(body, callback) {
        User.find((err, data) => {
            if (err)
                callback(err);
            else
                callback(null, data);
        })

    }

}
module.exports = new UserModel();