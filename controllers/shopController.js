require('dotenv').config();
const express = require('express');
const router = express.Router();
const Shop = require('../models/shop');
const User = require('../models/user');
const Product = require('../models/product');
const { requireAuth } = require('../middleware/authMiddleware');

//dependencies needed for image saving
const multer = require('multer');
const imgur = require('imgur');
const fs = require('fs');

// ==== 
// set up for multer diskstorage
// ====
const diskStorage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  })

// after you setup multer to choose your disk storage, you can initialize a middleware to use for your routes
const uploadMiddleware = multer({ storage: diskStorage });
router.use(uploadMiddleware.any());

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



//list all shops (not protected, for all to see)
router.get('/', async (req,res) => {

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
router.get('/users/:userId', requireAuth, async (req,res) => {
    try {         
        //some codes to parse image stuff
        const result = await Shop.find({userId: req.params.userId}); 
        const user = await User.findOne({_id: req.params.userId}, 'username'); 
        
        res.status(201).json({data: result, username: user.username});   
    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }
})

//for create shop route
router.post('/users/:userId', requireAuth, async (req,res) => {
    try {       
        if (req.profile.usertype === "seller") {
        // settings for IMGUR
        // Change this cliend id to your own.
        const clientId = process.env.IMGUR_ID;        
        imgur.setClientId(clientId);        

        const inputField = {
            ...req.body, 
            userId: req.params.userId
        }

        if (req.files[0]) {
            const file = req.files[0];
            console.log(file);
            const urlImage = await imgur.uploadFile(`./uploads/${file.filename}`);
            fs.unlinkSync(`./uploads/${file.filename}`);
            
            inputField.shopimage = urlImage.link;
        }

        const shop = await Shop.create(inputField);       
        res.status(201).json({ shopId: shop._id, name: shop.name });
        } else {
            res.status(400).json({errorMsg: "you are not a seller"});
        }

    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }
})

//get each shop details
router.get('/:shopId', async(req,res) => {
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
router.put('/:shopId', requireAuth, async (req,res) => {
    try {                          
        // settings for IMGUR
        // Change this cliend id to your own.
        const clientId = process.env.IMGUR_ID;        
        imgur.setClientId(clientId);       

        const updatedField = {
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            contactnumber: req.body.contactnumber,
            postalcode: req.body.postalcode
        }

        if (req.files[0]) {
            const file = req.files[0];
            console.log("files here", file);
            const urlImage = await imgur.uploadFile(`./uploads/${file.filename}`);
            fs.unlinkSync(`./uploads/${file.filename}`);
            
            updatedField.shopimage = urlImage.link;
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
router.delete('/:shopId', requireAuth, async(req,res) => {
    try {        
        const product = await Product.deleteMany({shopId: req.params.shopId});
        const result = await Shop.deleteOne({_id: req.params.shopId});        
        res.status(201).json({data: "Shops and Products Deleted"});
        //redirecting is done on the client side
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
});

module.exports = router;