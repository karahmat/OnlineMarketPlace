require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Shop = require('../models/shop');
const { requireAuth } = require('../middleware/authMiddleware');

//function to handle errors
const handleErrors = (err) => {
    console.log("handleErrors function is called");  
    let errors = { name: '', address: '', contactnumber: '' };
   
    //duplicate error code 
    if (err.code === 11000) {
        errors.name = "That shop name is already registered";
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

//for create shop route
router.post('/api/shops/by/:userId', requireAuth, async (req,res) => {
    try {          
        console.log(req.body);
        //some codes to parse image stuff

        const inputField = {
            ...req.body, 
            userId: req.params.userId
        }
        const shop = await Shop.create(inputField);       
        res.status(201).json({ shopId: shop._id, name: shop.name });   
    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }
})

//list all shops
router.get('/api/shops', async (req,res) => {

    try {                  
        //some codes to parse image stuff
        //
        const result = await Shop.find();               
        res.status(201).json({data: result});   
    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }
});

//List MyShops
router.get('/api/shops/by/:userId', requireAuth, async (req,res) => {
    try {          
        console.log("this api was called");
        //some codes to parse image stuff
        const result = await Shop.find({userId: req.params.userId});       
        console.log(result);
        res.status(201).json({data: result});   
    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }
})



module.exports = router;