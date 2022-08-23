'use strict'

const express = require('express');
const bcrypt = require('bcryptjs');
const {User, Course} = require('./models');
const {authenticateUser} = require('./middleware/authentication');
const router = express.Router();

let errors = [];

const id_to_user = {
    include: [
        {
            model: User,
            as: 'user'
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

router.get('/users', authenticateUser ,handler( async (req, res)=>{
    const user = req.currentUser;
    res.status(200).json(user);
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
    const course  = await Course.findByPk(req.params.id, id_to_user);
    res.status(200).json(course);
}));

// post a course
router.post('/courses/', authenticateUser, handler( async (req, res)=>{
    // not sure if this is the intended use or not
    const user = req.currentUser;
    const info = req.body;
    info.userId = user.id;
    await Course.create(info);
    res.status(201).end();
}));

// update a course
router.put('/courses/:id', authenticateUser, handler( async (req, res)=>{
    const user = req.currentUser;
    const update = await Course.findByPk(req.params.id);
    console.dir(user);
    console.dir(update);
    console.log(user.id == update.userId);
    if(user.id === update.userId){
        update.update(req.body);
        res.status(204).end();
    }else{
        res.status(401).json({ message: 'Access Denied' });
    }


}));

// delete a course
router.delete('/courses/:id', authenticateUser, handler( async (req, res)=>{
    const user = req.currentUser;
    const del = await Course.findByPk(req.params.id);
    if(user.id === del.userId){
        del.destroy();
        res.status(204).end();
    }else{
        res.status(401).json({ message: 'Access Denied' });
    }

}));

module.exports = router;