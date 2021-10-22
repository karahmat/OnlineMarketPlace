require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express()
const server = require('http').Server(app)
const PORT = process.env.PORT

const userRoute = require('./controllers/userController')
const shopRoute = require('./controllers/shopController')
const productRoute = require('./controllers/productController')
const conversationRoute = require('./controllers/conversationController')
const messageRoute = require('./controllers/messageController')
const orderRoute = require('./controllers/orderController')
//Socket configuration
let io
if (process.env.NODE_ENV === 'production') {
  io = require('socket.io')(server)
} else {
  //Socket
  io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })
}

const db = mongoose.connection
const mongoURI = process.env.MONGO_URI
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('The connection with mongod is established')
  }
)

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'))
db.on('connected', () => console.log('mongo connected: ', mongoURI))
db.on('disconnected', () => console.log('mongo disconnected'))

// //Set Static File
// app.use(express.static('public'));

//Middleware
app.use(express.json({ extended: false }))
app.use(cookieParser())

//Routes
app.use(userRoute)
app.use(shopRoute)
app.use(productRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/messages', messageRoute)
app.use(orderRoute)

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')))
  // Handle React routing, return all requests to React app
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}

// Listen on port 3000
server.listen(PORT, () => console.info('Listening on port ' + PORT))

//Sockets stuff
let users = []

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId })
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId)
}

io.on('connection', (socket) => {
  //when connect
  console.log('a user connected.')

  //take userId and socketId from user
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id)
    io.emit('getUsers', users)
  })

  //send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId)
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
      })
    }
  })

  //when disconnect
  socket.on('disconnect', () => {
    console.log('a user disconnected!')
    removeUser(socket.id)
    io.emit('getUsers', users)
  })
})
