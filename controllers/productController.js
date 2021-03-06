require('dotenv').config();
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Shop = require('../models/shop');
const fetch = require('node-fetch');
const { requireAuth } = require('../middleware/authMiddleware');

//dependencies needed for image saving
const multer = require('multer');
const imgur = require('imgur');
const fs = require('fs');

// ====
// set up for multer diskstorage
// ====
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
})

const uploadMiddleware = multer({
  storage: diskStorage,
}).any();

router.use(uploadMiddleware);

//function to handle errors
const handleErrors = (err) => {
  console.log('handleErrors function is called');
  let errors = { name: '', price: '', category: '', quantity: 0 };

  //validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach((item) => {
      errors[item.properties.path] = item.properties.message;
    })
  }

  return errors
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

router.get('/', async (req, res) => {
  try {
    if (req.query.shopId) {
      const result = await Product.find({ shopId: req.query.shopId }).sort({ createdAt: -1 }).exec();
      res.status(201).json({ data: result });
    } else if (req.query.category) {
      const result = await Product.find({ category: req.query.category });
      res.status(201).json({ data: result });
    } else if (req.query.pricelower) {
      const result = await Product.find({
        price: { $lte: req.query.pricelower },
      });
      res.status(201).json({ data: result })
    } else if (req.query.pricehigher) {
      const result = await Product.find({
        price: { $gte: req.query.pricehigher },
      });
      res.status(201).json({ data: result })
    } else {
      const result = await Product.find().sort({ timestamp: -1 })
      res.status(201).json({ data: result });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
})

//return all products w/ pagination
router.get('/bypage', async (req, res) => {
  const { page, limit } = req.query;

  try {
    // execute query with page and limit values
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // get total documents in the Product collection
    // const count = await Product.countDocuments()

    // return response with posts, total pages, and current page
    res.status(201).json({
      data: products,
      //   totalPages: Math.ceil(count / limit),S
      //   currentPage: page,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
})

//add an array of products to a certain shop

router.post(
  '/shops/:shopId/users/:userId',
  requireAuth,
  async (req, res) => {
    try {
      // settings for IMGUR
      // Change this cliend id to your own.
      const clientId = process.env.IMGUR_ID;
      imgur.setClientId(clientId);

      const numberOfNames = Object.keys(req.body).filter((item) =>
        item.includes('name')
      );
      const products = new Array(numberOfNames.length);

      for (let i = 0; i < products.length; i++) {
        products[i] = {
          name: '',
          description: '',
          category: '',
          price: '',
          quantity: '',
          image: '',
          rating: {
            rate: 1,
            count: 1,
          },
        };
        products[i].name = req.body[`name${i}`];
        products[i].description = req.body[`description${i}`];
        products[i].category = req.body[`category${i}`];
        products[i].price = req.body[`price${i}`];
        products[i].quantity = req.body[`quantity${i}`];
        products[i].shopId = req.params.shopId;

        if (req.files[i]) {
          const file = req.files[i];
          const urlImage = await imgur.uploadFile(`./uploads/${file.filename}`);
          fs.unlinkSync(`./uploads/${file.filename}`);
          products[i].image = urlImage.link;
        }
      }

      if (req.profile.id === req.params.userId) {
        
        const product = await Product.insertMany(products);
        res.status(201).json({ data: 'success' });
      } else {
        res.status(400).json({ errorMsg: 'You are not authorised' });
      }
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  }
)


//list categories
router.get('/categories', async (req, res) => {
  try {
    const result = await Product.distinct('category')
    res.status(201).json(result)
  } catch (err) {
    console.log(err)
  }
})

//get each product details
router.get('/:productId', async (req, res) => {
  try {
    const result = await Product.findOne({ _id: req.params.productId })
    const shop = await Shop.findOne({ _id: result.shopId }, 'userId')
    const finalResult = {
      ...result._doc,
      userId: shop.userId,
    }

    res.status(201).json({ data: finalResult })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
})

//edit each product details
router.put(
  '/:productId/shops/:shopId/users/:userId',
  requireAuth,
  async (req, res) => {
    try {
      
      // settings for IMGUR
      // Change this cliend id to your own.
      const clientId = process.env.IMGUR_ID
      imgur.setClientId(clientId)

      const updatedField = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
      }

      if (req.files[0]) {
          const file = req.files[0]
          const urlImage = await imgur.uploadFile(`./uploads/${file.filename}`)
          fs.unlinkSync(`./uploads/${file.filename}`)
          updatedField.image = urlImage.link
      }

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.params.productId },
        updatedField,
        { new: true }
      )
      if (req.profile.id === req.params.userId) {
        res.status(201).json({ data: 'success' })
      } else {
        res.status(400).json({ errorMsg: 'You are not authorised' })
      }
    } catch (err) {
      const errors = handleErrors(err)
      res.status(400).json({ errors })
    }
  }
)

//delete product
router.delete(
  '/:productId',
  requireAuth,
  async (req, res) => {
    try {
      if (req.profile.id === req.body.userId) {
        const result = await Product.deleteOne({ _id: req.params.productId })
        res.status(201).json({ data: 'success' })
      } else {
        res.status(400).json({ errorMsg: 'You are not authorised' })
      }
    } catch (err) {
      const errors = handleErrors(err)
      res.status(400).json({ errors })
    }
  }
)

//search products
router.get('/search/:searchValue', async (req, res) => {
  try {
    const result = await Product.find({
      $or: [
        { name: { $regex: req.params.searchValue, $options: 'i' } },
        { description: { $regex: req.params.searchValue, $options: 'i' } },
      ],
    })

    res.status(201).json({
      data: result,
      searchitem: req.params.searchValue,
    })
  } catch (err) {
    console.log(err)
  }
})


module.exports = router
