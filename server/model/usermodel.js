var nodemailer = require('nodemailer');
const mail = require('../util/mail');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bcrypt = require('bcrypt');
const url = 'mongodb://localhost:27017';
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
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    forgot_token: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }

});
const User = mongoose.model('user', userSchema);

class UserModel {
    register(body, callback) {
        collection.findOne({ email: body.email }, (err, result) => {
            if (err)
                callback(err)
            else if (result)
                callback({ message: 'Email already registered' })
            else {
                bcrypt.hash(body.password, 10, (err, hash) => {
                    if (err)
                        throw err;
                    const user = new User({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email,
                        password: hash
                    })
                   
                    user.save((err, data) => {
                        if (err) {
                            callback(err)
                        } else {
                            callback(null, data)
                        }
                    })
                    let url='http://localhost:3000/login'
                    mail.sendLink(url,body)
                })
            }
        })
    }
}
module.exports = new UserModel();