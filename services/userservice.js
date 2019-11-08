const model = require('../model/usermodel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
class userS {

    encryptPassword(pas) {
        let dPassword = bcrypt.genSaltSync(10);
        let hashPassword = bcrypt.hashSync(pas, dPassword);
        return hashPassword;
    }


    register(registerData) {
        //console.log("gyug---",registerData);
        registerData.password = this.encryptPassword(registerData.password);
        //console.log("pass--",registerData.password);

        return new Promise(function (resolve, reject) {

            var initPromise = model.register(registerData);

            initPromise.then(function (data) {
                //console.log(data);
                //console.log("service data password---", data.password);

                var userData = {
                    "firstName": data.firstName,
                    "lastName": data.lastName,
                    "emailId": data.emailId,
                    "password": data.password
                };
                
                //console.log("user save data--",userData);

                var saveDataPromise = model.saveUser(userData);
                saveDataPromise.then(function (data1) {
                    //console.log("..............",data1);
                     resolve(data1)
                
                }).catch(function (err) {
                    reject(err)
                })
                console.log("registeration successful");
                //resolve(data)

            }).catch(function (error) {
                reject(error)
            })
        })
    }



login(body, callback) {
    model.login(body, (err, data) => {
        if (err)
            callback(err)
         else 
            callback(null, data)
            


    })
}
varifyEmail(body, callback) {
    model.varifyEmail(body, (err, data) => {
        if (err)
            callback(err);
        else
            callback(null, data);
    })
}

forgot(body, callback) {

    model.forgot(body, (err, data) => {
        if (err) {
            callback(err)
        } else {
            callback(null, data);
        }
    })
}

update(body, callback) {
    model.updateToken(body, (err, data) => {
        if (err) {
            callback(err)
        } else {

            callback(null, data);
        }
    })

}
reset(body, callback) {
    model.reset(body, (err, data) => {
        if (err)
            callback(err)
        else
            callback(null, data);
    })
}


getallUsers(body, callback) {
    model.getallUsers(body, (err, data) => {
        if (err)
            callback(err)
        else
            callback(null, data)
    })
}

}

module.exports = new userS();