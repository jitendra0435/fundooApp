var jwt = require('jsonwebtoken');
checkToken=(req,res,next)=>{
    var bearerHeader = req.body.token;
    req.authenticated = false;
    if (bearerHeader){
        jwt.verify(bearerHeader, 'secret', function (err, decoded){
            if (err){
                console.log(err);
                req.authenticated = false;
                req.decoded = null;
                next();
            } else {
                req.decoded = decoded;
                req.authenticated = true;
                next();
            }
        });
    }
}
module.exports={checkToken}

