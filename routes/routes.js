const express = require('express');
const router = express.Router();
const userC = require('../controller/Ucontroller');
const model=require('../model/usermodel')
const auth = require('../auth/auth');
router.post('/register', userC.register);
router.post('/login',userC.login);
router.post('/varifyEmail',userC.varifyEmail);
router.post('/forgot',userC.forgot);
router.post('/reset',auth.checkToken,model.reset);
router.get('/getallusers',userC.getallUsers)
module.exports = router;