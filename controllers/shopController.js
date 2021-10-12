require('dotenv').config();
const express = require('express');
const router = express.Router();
const Shop = require('../models/shop');
const User = require('../models/user');
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

//list all shops (not protected, for all to see)
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
        //some codes to parse image stuff
        const result = await Shop.find({userId: req.params.userId});  
        
        res.status(201).json({data: result});   
    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }
})

//get each shop details
router.get('/api/shops/shop/:shopId', async(req,res) => {
    try {                  
        //some codes to parse image stuff
        
        const result = await Shop.findOne({_id: req.params.shopId});   
        const user = await User.findOne({_id: result.userId }, 'username');                
        res.status(201).json({data: result, userData: user });   
    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }
});

//edit each shop details
router.put('/api/shops/shop/:shopId', requireAuth, async (req,res) => {
    try {                  
        //some codes to parse image stuff

        const updatedField = {
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            contactnumber: req.body.contactnumber,
            postalcode: req.body.postalcode
        }
        const updatedShop = await Shop.findOneAndUpdate({_id: req.params.shopId}, updatedField, {new: true});  
        
        res.status(201).json({data: updatedShop});   
    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }
});

//delete shop
router.delete('/api/shops/shop/:shopId', requireAuth, async(req,res) => {
    try {
        console.log("delete API was called")
        const result = await Shop.deleteOne({_id: req.params.shopId});
        res.status(201).json({data: "User Deleted"});
        //redirecting is done on the client side
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
});

module.exports = router;