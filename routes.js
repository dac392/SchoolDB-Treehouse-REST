'use strict'

const express = require('express');

const {User, Course} = require('./models');
const router = express.Router();

function handler(cb){
    return async (req, res, next)=>{
        try{
            console.log(req.body)
            await cb(req, res, next);
        }catch(error){
            next(error);
        }
    }
}

router.get('/users', handler( async (req, res)=>{
    let users = await User.findAll();
    res.json(users);
}));

router.post('/users', handler(async (req, res)=>{
    console.dir(req.body);
    await User.create(req.body);
    res.status(201).json({"message": "User successfully created!"});
}));

// router.post('/users',async (req, res)=>{
//     try{
//         console.dir(req.body);

//     }catch(error){
//         next(error);
//     }
// })

module.exports = router;