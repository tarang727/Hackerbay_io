'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chai_http = require('chai-http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidGFyYW5nIiwicGFzc3dvcmQiOiJiYXJ1YSJ9LCJpYXQiOjE1MzQ2NTIzMDUsImV4cCI6MTUzNTUxNjMwNX0.7IqxGAEeaVe4kicfqhZ7ydvDDurc4sFutl3j9XDJn3U';
const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoicmFodWwiLCJwYXNzd29yZCI6InBhc3N3b3JkIn0sImlhdCI6MTUxNzQxNTQ5OSwiZXhwIjoxNTE4Mjc5NDk5fQ.IHN-c4gt4REBPH74K7DTynbdQ5yCt2_bMd4nLCQfd0K';

let { app } = require('../server');
chai.should();

chai.use(chai_http);

describe('Protected Endpoints: THUMBNAIL_GENERATION', () => {
  it('POST /home/create_thumbnail should return an image if image_url is provided along with JWT.', (done) => {
    chai.request(app)
      .post('/home/create_thumbnail')
      .send({ image_url: 'https://www.livemint.com/rf/Image-621x414/LiveMint/Period2/2018/08/17/Photos/Home%20Page/Kerala-10-U205730966665TF--621x414@LiveMint.jpg' })
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('POST /home/create_thumbnail should not return an image if wrong image_url is provided along with JWT.', (done) => {
    chai.request(app)
      .post('/home/create_thumbnail')
      .send({ image_url: 'fvdvdfdffvd' })
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(500);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('Read unsuccessful from given URL');
        done();
      });
  });
  it('POST /home/create_thumbnail should not return an image if image_url is not provided.', (done) => {
    chai.request(app)
      .post('/home/create_thumbnail')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('Image URL missing');
        done();
      });
  });
  it('POST /home/create_thumbnail should return status of 400 if JWT is not provided.', (done) => {
    chai.request(app)
      .post('/home/create_thumbnail')
      .send({ image_url: 'http://somedomain.com/someimage.png' })
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('No token provided.');
        done();
      });
  });
  it('POST /home/create_thumbnail should return status of 403 if JWT is incorrectly provided.', (done) => {
    chai.request(app)
      .post('/home/create_thumbnail')
      .send({ image_url: 'http://somedomain.com/someimage.png' })
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
