const express = require('express');
const router = express.Router();
const userC = require('../controller/Ucontroller');
const auth = require('../auth/auth');
router.post('/register', userC.register);
router.post('/login',userC.login);
router.post('/varifyEmail',userC.varifyEmail);
module.exports = router;