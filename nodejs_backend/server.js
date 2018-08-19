'use strict';
// Packages to be used
const express = require('express');
let app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');



// Local files
const config = require('./config');
const public_routes = require('./routes/public');
const protected_routes = require('./routes/protected');



// Using the configurations
let PORT = config.PORT;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));



// Routes are set up
app.use(public_routes);
app.use(protected_routes);



// Listening on the port
app.listen(PORT, () => {
  console.log(`The application is up and running in PORT : ${PORT}`);
});


//App is ready for consumption
module.exports = { app };
