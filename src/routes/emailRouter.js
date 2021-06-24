// manage vocabulary routes
const express = require('express');
const router = express.Router();

const emailController = require('../app/controllers/EmailController');


router.post('/', emailController.index);

module.exports = router;
