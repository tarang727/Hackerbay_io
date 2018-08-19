'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chai_http = require('chai-http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidGFyYW5nIiwicGFzc3dvcmQiOiJiYXJ1YSJ9LCJpYXQiOjE1MzQ2NTIzMDUsImV4cCI6MTUzNTUxNjMwNX0.7IqxGAEeaVe4kicfqhZ7ydvDDurc4sFutl3j9XDJn3U';
const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoicmFodWwiLCJwYXNzd29yZCI6InBhc3N3b3JkIn0sImlhdCI6MTUxNzQxNTQ5OSwiZXhwIjoxNTE4Mjc5NDk5fQ.IHN-c4gt4REBPH74K7DTynbdQ5yCt2_bMd4nLCQfd0K';

let { app } = require('../server');
chai.should();

chai.use(chai_http);

describe('Checking HOME', () => {
  it('GET /home should return a user object if JWT is provided.', (done) => {
    chai.request(app)
      .get('/home')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        res.body.should.have.property('iat');
        res.body.should.have.property('exp');
        done();
      });
  });
  it('GET /home should return a stattus of 400 if JWT is not provided.', (done) => {
    chai.request(app)
      .get('/home')
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('No token provided.');
        done();
      });
  });
  it('GET /home should return a stattus of 403 if JWT is incorrectly provided.', (done) => {
    chai.request(app)
      .get('/home')
      .set('token', incorrectToken)
      .end((err, res) => {
        res.should.have.status(403);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('Incorrect Token. Authenticaion Failed.');
        done();
      });
  });
});
