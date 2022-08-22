'use strict'

const express = require('express');

const router = express.Router();

router.get('/users', (req, res)=>{
    console.log("trying to get /api/users");
});

router.post('/users', (req, res)=>{
    console.log("trying to post /api/users");
});

module.exports = router;