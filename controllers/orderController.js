const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const Product = require('../models/product')
const { requireAuth } = require('../middleware/authMiddleware')

//add orders from cart to DB
router.post('/', requireAuth, async (req, res) => {
  const { user, orderItems, shippingAddress, paymentMethod } = req.body

  //to delete quantity in product model
  const updateProductQty = async () => {
    try {
      for (let i = 0; i < orderItems.length; i++) {
        await Product.findOneAndUpdate(
          { _id: orderItems[i].productId },
          { $inc: { quantity: -orderItems[i].qty } }
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  await updateProductQty()

  const totalPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  )

  const order = {
    user,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  }

  try {
    await Order.create(order)

    res.send('order created')
  } catch (error) {
    res.status(500)
  }
})

router.get('/', async (req, res) => {
  try {
    const result = await Order.find()
    res.status(201).json({ data: result })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json(errors)
  }
})

router.get('/deleteall', async (req, res) => {
  try {
    await Order.deleteMany({})
    res.send('orders deleted')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
