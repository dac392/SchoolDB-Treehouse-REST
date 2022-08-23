'use strict'

const express = require('express');
const bcrypt = require('bcryptjs');
const {User, Course} = require('./models');
const router = express.Router();

let errors = [];

const id_to_user = {
    include: [
        {
            model: User,
            as: 'Teacher'
        }
    ]
}

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
    const user = req.body;
    let password = user.password;
    if (!password) {
        errors.push('Please provide a value for "password"');
    } else if (password.length < 8 || password.length > 20) {
        errors.push('Your password should be between 8 and 20 characters');
    } else {
        user.password = bcrypt.hashSync(password, 10);
    }

    if(errors.length > 0){
        res.status(400).json({errors});
    }else{
        await User.create(req.body);
        res.status(201).end();
    }

}));

// get all courses
router.get('/courses/', handler( async (req, res)=>{
    const courses = await Course.findAll(id_to_user);
    res.status(200).json(courses);
}));

// get a course
router.get('/courses/:id', handler( async (req, res)=>{
    console.log(req.params.id);
    const course  = await Course.findByPk(req.params.id, id_to_user);
    res.status(200).json(course);
}));

// post a course
router.post('/courses/', handler( async (req, res)=>{
    await Course.create(req.body);
    res.status(201).end();
}));

// update a course
router.put('/courses/:id', handler( async (req, res)=>{
    const update = await Course.findByPk(req.params.id);
    //console.log(update)
    update.update(req.body);
    //console.log(update);
    res.status(204).end();

}));

// delete a course
router.delete('/courses/:id', handler( async (req, res)=>{
    const del = await Course.findByPk(req.params.id);
    del.destroy();
    res.status(204).end();
}));

module.exports = router;