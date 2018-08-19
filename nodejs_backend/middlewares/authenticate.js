'use strict';


//Packages to be used
const express = require('express');
let app = express();
const jwt = require('jsonwebtoken');



// Local files
const config = require('../config');
app.set('tarang', config.passkey);



// Authentication done by middleware
module.exports = (req, res, next) => {
  
  const token = req.body.token || req.query.token || req.headers['token'];  //taking token from form body/query/header

  if (token) {
    
    jwt.verify(token, app.get('tarang'), (err, decoded) => { //verify token and check expiry 
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Incorrect Token. Authenticaion Failed.'
        });
      } else {
        // everything is fine
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // No token found 
    return res.status(400).send({
      success: false,
      message: 'No token provided.'
    });
  }
};
