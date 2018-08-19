'use strict';
// Packages to be used
const express = require('express');
let app = express();
const jwt = require('jsonwebtoken');



// Local files
const config = require('../config');



// Using the configurations
let PORT = config.PORT;
app.set('tarang', config.passkey);



// Making sure the app is up and running
app.get('/', (req, res) => {
  res.status(200).send(`The application is up and running in http://localhost:${PORT}. POST a username and password to http://localhost:${PORT}/login and the signed token will be returned as a string. Pass that token using 'token' header to GET http://localhost:${PORT}/home`);
});



// POST /login
app.post('/login', (req, res) => {
  
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) { // checking if both parameters are present
    
    const object = {
      user: {
        username,
        password
      }
    };
  
    let token = jwt.sign(object, app.get('tarang'), {
      //token expires in 10 days
      expiresIn: '10d'
    });
    res.status(200).json({
      success: true,
      token: token
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Please pass the username and password in the form.'
    });
  }
});

module.exports = app;
