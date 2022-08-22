'use strict'

const express = require('express');
const {User, Course} = require('./models');
const router = express.Router();

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
    console.dir(req.body);
    await User.create(req.body);
    res.status(201).json({"message": "User successfully created!"});
}));

// get all courses
router.get('/courses/', handler( async (req, res)=>{
    const courses = await Course.findAll(id_to_user);
    res.json(courses);
}));

// get a course
router.get('/courses/:id', handler( async (req, res)=>{
    console.log(req.params.id);
    const course  = await Course.findByPk(req.params.id, id_to_user);
    res.json(course);
}));

// post a course
router.post('/courses/', handler( async (req, res)=>{
    await Course.create(req.body);
    res.status(201).json({"message": "Course successfully created!"});
}));

// update a course
router.put('/courses/:id', handler( async (req, res)=>{

}));

// delete a course
router.delete('/courses/:id', handler( async (req, res)=>{

}));

module.exports = router;