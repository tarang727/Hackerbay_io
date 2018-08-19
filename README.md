# Hackerbay_io

## Node.js Backend
### Endpoints
The API features the following endpoint functionalities  

**Public Endpoints**  
1. */login*
    * The api accepts any username/password.
    * Returns a signed [Json Web Token](https://jwt.io/) which can be used to validate future requests.

**Protected Endpoints**  

The following two endpoints should be protected. The JWT obtained in the _/login_ endpoint must be attached to each request.  If the JWT is missing or invalid, these endpoints should reject the request.
1. */home/apply_json_patch*
    * Request body should contain a JSON object and a [JSON patch object](http://jsonpatch.com/).
    * Apply the json patch to the json object, and return the resulting json object.
2. */home/create_thumbnail*
    * Request should contain a public image URL.
    * Download the image, resize to 50x50 pixels, and return the resulting thumbnail.
___

### Fulfilled Requirements  
1. Code Requirements
    * Included [Mocha](https://mochajs.org/) as a test suite for the microservice.
    * Used modern javascript ES6 syntax.
2. Other Requirements
    * Used git for version control, and hosted the project in a Github repository.
    * Project contains documentation with setup and usage instructions.
    * Project installs all dependencies with `npm install`, starts the server with `npm start`, and runs the test suite with `npm test`.
3. Bonus Points
    * 100% code coverage in test suite by [Istanbul](https://github.com/gotwarlost/istanbul).
    * Included Swagger specifications. Copy paste the contents of swagger.yaml to [Swagger](http://editor.swagger.io).
    * Integrated a centralized app logging/monitoring system using `morgan`.
    * Used [esLint](https://eslint.org) for Javascript Style and Linting.
    * Included a working Dockerfile with the app directory
    
### INSTRUCTIONS
1. Clone the repository
  ```
  $> git clone https://github.com/tarang727/Hackerbay_io.git
  ```
2. Install all the dependencies.
  ```
  $> npm install
  ```
3. See all the test cases pass.
  ```
  $> npm test
  ```
4. Start the API server.
  ```
  $> npm start
  ```    


## ReactJS Frontend

1. git clone the repository https://github.com/tarang727/Hackerbay_io.git
2. go to reactJS_frontend folder `$ cd reactJS_frontend`
3. install dependencies `$ npm install`
4. Start the game in production mode with:
```
  npm serve
```

5. Start the game in development mode with:
```
  npm start
```
