require('dotenv').config();
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const fetch = require('node-fetch');
const { requireAuth } = require('../middleware/authMiddleware');

//function to handle errors
const handleErrors = (err) => {
    console.log("handleErrors function is called");  
    let errors = { name: '', price: '', category: '', quantity: 0 };
   
    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(item => {
            errors[item.properties.path] = item.properties.message;            
        });
    }

    return errors;
}

// router.get('/api/productseed', async (req,res) => {

//     const shops = [
//     "6161170c088cbec13615d885",
//     "616127872ae255009838ef30",
//     "616173ac5426e629e2bb5bf6",
//     "616319d22a78962ce71e891e"
//     ];

//     const quantityRandom = [ 5, 10, 150, 2000];

//     const result = await fetch("https://fakestoreapi.com/products");
//     const data = await result.json();    
//     const newArray = []
//     for (i=0; i<data.length; i++) {
//         const shopIndex = i%shops.length;
//         newArray.push({
//             shopId: shops[shopIndex], 
//             name: data[i].title, 
//             price: data[i].price, 
//             description: data[i].description,
//             category: data[i].category, 
//             image: data[i].image, 
//             quantity: quantityRandom[shopIndex], 
//             rating: {
//                 rate: data[i].rating.rate,
//                 count: data[i].rating.count
//             }
//         });
//     }
    
//     const seedData = await Product.insertMany(newArray);    
//     res.status(201).json(seedData);

// });

router.get('/api/products', async(req,res) => {
    
    try {        
        if (req.query.shopId) {
            const result = await Product.find({shopId: req.query.shopId});
            res.status(201).json({data: result});
        } else if (req.query.productId) {
            const result = await Product.find({productId: req.query.productId});
            res.status(201).json({data: result});
        } else if (req.query.category) {
            const result = await Product.find({category: req.query.category});
            res.status(201).json({data: result});
        } else if (req.query.pricelower) {
            const result = await Product.find({price: {$lte: req.query.pricelower}});
            res.status(201).json({data: result});
        } else if (req.query.pricehigher) {
            const result = await Product.find({price: {$gte: req.query.pricehigher}});
            res.status(201).json({data: result});
        } else {
            const result = await Product.find();
            res.status(201).json({data: result})
        }

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }   
    
});

//add an array of products to a certain shop
router.post("/api/products/by/:shopId", requireAuth, async(req, res) => {

    try {       
        
        //some codes to parse image stuff

        //I assume there will be more than one product created at once, so req.body.data is an array
        // body: JSON.stringify({data: allFormData }), whereby allFormData is an array of Objects
        const newArray = [];
        req.body.allFormData.forEach((eachItem) => {
            newArray.push({
                ...eachItem, 
                shopId: req.params.shopId
            })
        });
        const product = await Product.insertMany(newArray);       
        res.status(201).json({ shopId: shop._id, name: shop.name });   
    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }

    
});

//get each product details
router.get('/api/products/product/:productId', async(req,res) => {
    try {                  
        //some codes to parse image stuff
        
        const result = await Product.findOne({_id: req.params.productId});           
        res.status(201).json({data: result});   
    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }
});

//edit each product details
router.put('/api/products/product/:productId', requireAuth, async (req,res) => {
    try {                  
        //some codes to parse image stuff

        const updatedField = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            quantity: req.body.quantity,            
        }
        const updatedProduct = await Product.findOneAndUpdate({_id: req.params.productId}, updatedField, {new: true});  
        
        res.status(201).json({data: updatedProduct});   
    }
    catch (err) {                    
        const errors = handleErrors(err);        
        res.status(400).json({errors});
    }
});

//delete shop
router.delete('/api/products/product/:productId', requireAuth, async(req,res) => {
    try {
        
        const result = await Product.deleteOne({_id: req.params.productId});
        res.status(201).json({data: "Product Deleted"});
        
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
});


module.exports = router;