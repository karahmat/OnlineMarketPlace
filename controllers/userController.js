require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { requireAuth } = require('../middleware/authMiddleware');

//function to handle errors
const handleErrors = (err) => {
    console.log("handleErrors function is called");  
    let errors = { email: '', password: '', token: '' };

    //incorrect username
    if (err.message === "incorrect email") {
        errors.email = "This email is not registered";
    }

    //incorrect password
    if (err.message === "incorrect password") {
        errors.password = "This password is incorrect";
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
        
        const user = await User.create(req.body);
        const token = createToken(user._id, user.usertype);
        //send cookie to browser, but it cannot be accessed by clicking document.cookie due to httpOnly: true
        res.cookie('jwt', token, {httpOnly: false, maxAge: maxAge * 1000}); //maxAge in milliseconds here
        res.status(201).json({ userId: user._id, usertype: user.usertype });   
    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }

});

//list all users
router.get('/api/users', requireAuth, async (req,res) => {
        
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
router.get('/api/users/:userId', requireAuth, async (req,res) => {

    try {
        const user = await User.findOne({_id: req.params.userId});
        res.status(201).json({
            userId: user._id,
            username: user.username,
            email: user.email, 
            usertype: user.usertype
        });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
})

//update a user
router.put('/api/user/:userId', requireAuth, async (req, res) => {
    
    try {
        const updatedField = {
            username: req.body.username, 
            usertype: req.body.usertype
        }
        const user = await User.findOneAndUpdate({_id: req.params.userId}, updatedField, {new: true});        
        const token = createToken(user._id, user.usertype);
        res.cookie('jwt', token, {httpOnly: false, maxAge: maxAge * 1000}); //maxAge in milliseconds here        
        res.status(201).json({data: "success"});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}); 

//delete a user
router.delete('/api/user/:userId', async (req,res) => {
    try {
        const result = await User.deleteOne({_id: req.params.userId});
        res.status(201).json({data: "User Deleted"});
        //redirecting is done on the client side
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
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
        console.log(errors);
        res.status(400).json({ errors });
    }
    
});

//user signout
router.get('/api/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1} );
    res.status(200).json({data: 'signed out'})
});

module.exports = router;

