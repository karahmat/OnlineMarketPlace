require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//authentication middleware
const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;
  
    //check json web token exists and is valid
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        
        if (err) {
          console.log(err.message);
          //res.status(201).json({errorMsg: err.message});
          //req.errorMsg = err.message;
        } else {
          req.profile = decodedToken;
          //req.errorMsg = null;          
          next();
        }
      })

    } else { //there is no token
        //req.errorMsg = "there is no token";        
        res.status(201).json({errorMsg: 'no token here'});
    }
}


//check current user middleware
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
              console.log(err.message);              
              next();
            } else {
              console.log("decodedtoken", decodedToken);
              let user = await User.findById(decodedToken.id);
              req.profile = user;
              next();
            }
          });
    } else {
        res.locals.user = null; //if user does not exist, then user property is null
        next();
    }
}

module.exports = {requireAuth, checkUser};