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

// app.get('/', (req,res) => {
//     res.send('ok');
// });


// Listen on port 3000
app.listen(PORT, () => console.info("Listening on port "+ PORT));