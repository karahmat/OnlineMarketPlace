require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// CONFIGURATION
const app = express();
const PORT = process.env.PORT;
const db = mongoose.connection;
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('The connection with mongod is established')
  })
  
// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'))
db.on('connected', () => console.log('mongo connected: ', mongoURI))
db.on('disconnected', () => console.log('mongo disconnected'))

//Set Static File
app.use(express.static('public'));

//Middleware
app.use(express.json({ extended: false }));
app.use(cookieParser());

//Routes
const userRoute = require('./controllers/userController');
app.use(userRoute);

const shopRoute = require('./controllers/shopController');
app.use(shopRoute);

const productRoute = require('./controllers/productController');
app.use(productRoute);

const conversationRoute = require('./controllers/conversationController');
app.use("/api/conversations", conversationRoute);

const messageRoute = require('./controllers/messageController');
app.use("/api/messages", messageRoute);

// Listen on port 3000
app.listen(PORT, () => console.info("Listening on port "+ PORT));

//Socket
const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {    
    addUser(userId, socket.id);
    io.emit("getUsers", users);
    
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if(user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
