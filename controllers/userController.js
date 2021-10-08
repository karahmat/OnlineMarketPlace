require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//function to handle errors
const handleErrors = (err) => {
    console.log("handleErrors function is called");
    console.log(err.message);
    let errors = { email: '', password: '' };

    //incorrect username
    if (err.message === "incorrect email") {
        errors.email = "That email is not registered";
    }

    //incorrect password
    if (err.message === "incorrect password") {
        errors.password = "That email and/or password is incorrect";
    }

    //duplicate error code 
    if (err.code === 11000) {
        errors.email = "That email is already registered";
        return errors;
    }

    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(item => {
            errors[item.properties.path] = item.properties.message;            
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60; //in seconds
const createToken = (id, usertype) => {
    return jwt.sign({ id, usertype }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};

//create a user
router.post('/api/signup', async (req,res) => {
    
    try {          
        console.log(req.body);
        const user = await User.create(req.body);
        const token = createToken(user._id, user.usertype);
        //send cookie to browser, but it cannot be accessed by clicking document.cookie due to httpOnly: true
        res.cookie('jwt', token, {httpOnly: false, maxAge: maxAge * 1000}); //maxAge in milliseconds here
        res.status(201).json({ user: user._id, usertype: user.usertype });   
    }
    catch (err) {                    
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }

});

//list all users
router.get('/api/users', async (req,res) => {
    
    try {  
        const users = await User.find();
        res.status(201).json({data: users});
    }
    catch (err) {                    
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
    
});

//fetch a user
router.get('/api/users/:userId', async (req,res) => {

    try {
        const user = await User.findOne({_id: req.params.id});
        res.status(201).json({data: user});

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
})

//update a user
router.put('/api/users/:userId', async (req, res) => {
    res.send('ok');
}) 

//delete a user
router.delete('/api/users/:userId', async (req,res) => {
    res.send('ok');
});

//user sign-in
router.post('/api/login', async (req,res) => {
    const {email, password} = req.body;
    
    try {
        const user = await User.login(email,password); //static method
        const token = createToken(user._id, user.usertype);
        res.cookie('jwt', token, {httpOnly: false, maxAge: maxAge * 1000}); //maxAge in milliseconds here
        res.status(200).json( { userId: user._id, username: user.username, email: user.email, usertype: user.usertype } )
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
    
});

//user signout
router.get('/api/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1} );
    res.status(200).json({data: 'signed out'})
});

module.exports = router;

