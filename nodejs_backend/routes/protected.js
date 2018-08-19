'use strict';
// Packages to be used
const express = require('express');
let app = express();
let api_routes = express.Router();
const jsonpatch = require('json-patch');
const Jimp = require('jimp');



// Local files
const authenticate = require('../middlewares/authenticate');



// Using the configurations
app.use('/home', api_routes);
api_routes.use(authenticate); // all routes starting from /home will require authentication



// GET /home route: Returns the user object
api_routes.get('/', (req, res) => {
  res.status(200).json( req.decoded );
});



// POST /home/apply_json_patch route
api_routes.post('/apply_json_patch', (req, res) => {
  const obj = req.body.obj;
  const json_patch = req.body.json_patch;

  if (obj && json_patch) { // checking if both parameters are present

    let ans = jsonpatch.apply(obj, json_patch);  // jsonpatch.apply automatically handles the incorrect json patch arrays passed as input
    
    res.status(200).json(ans);

  } else {
    res.status(400).json({
      success: false,
      message: 'JSON object and/or JSON patch array missing'
    });
  }
});



// POST /home/create_thumbnail route
api_routes.post('/create_thumbnail', (req, res) => {
  const image_url = req.body.image_url;

  if (image_url) { // parameter is present
    
    Jimp.read(image_url, (err, image) => { //read the image using Jimp
      if (err || !image) {
        res.status(500).json({
          success: false,
          message: 'Read unsuccessful from given URL'
        });
      } else {
        image.resize(50, 50).getBase64(Jimp.AUTO, (error, img) => {
          res.status(200).send(`<img src='${img}'>`);
        });
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Image URL missing'
    });
  }
});

module.exports = app;
