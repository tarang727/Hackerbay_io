'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chai_http = require('chai-http');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidGFyYW5nIiwicGFzc3dvcmQiOiJiYXJ1YSJ9LCJpYXQiOjE1MzQ2NTIzMDUsImV4cCI6MTUzNTUxNjMwNX0.7IqxGAEeaVe4kicfqhZ7ydvDDurc4sFutl3j9XDJn3U';
const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoicmFodWwiLCJwYXNzd29yZCI6InBhc3N3b3JkIn0sImlhdCI6MTUxNzQxNTQ5OSwiZXhwIjoxNTE4Mjc5NDk5fQ.IHN-c4gt4REBPH74K7DTynbdQ5yCt2_bMd4nLCQfd0K';

let { app } = require('../server');
chai.should();

chai.use(chai_http);

describe('Applying the JSON patch', () => {
  it('POST /home/apply_json_patch should return a json object if obj and json_patch objects are provided along with JWT.', (done) => {
    chai.request(app)
      .post('/home/apply_json_patch')
      .send({
        'obj': {
          'user': 'tarang',
          'passwd': 'barua'
        },
        'json_patch': [
          { 'op': 'replace', 'path': '/user', 'value': 'rahul' },
          { 'op': 'add', 'path': '/hello', 'value': ['world'] },
          { 'op': 'remove', 'path': '/passwd'}
        ]
      })
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        done();
      });
  });
  it('POST /home/apply_json_patch should return a json object if obj and patch objects are provided along with JWT even if patching removes everything from the original object.', (done) => {
    chai.request(app)
      .post('/home/apply_json_patch')
      .send({
        obj: {
          user: 'tarang',
          passwd: 'barua'
        },
        json_patch: [
          { 'op': 'remove', 'path': '/user' },
          { 'op': 'remove', 'path': '/passwd' }
        ]
      })
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        done();
      });
  });
  it('POST /home/apply_json_patch should return a status 400 if JWT is not passed.', (done) => {
    chai.request(app)
      .post('/home/apply_json_patch')
      .send({
        patch: [
          { 'op': 'remove', 'path': '/user' },
          { 'op': 'remove', 'path': '/passwd' }
        ]
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('No token provided.');
        done();
      });
  });
  it('POST /home/apply_json_patch should return a status 403 if JWT is incorrectly passed.', (done) => {
    chai.request(app)
      .post('/home/apply_json_patch')
      .send({
        patch: [
          { 'op': 'remove', 'path': '/user' },
          { 'op': 'remove', 'path': '/passwd' }
        ]
      })
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
  it('POST /home/apply_json_patch should return a status 400 if neither of the JSON objects are passed.', (done) => {
    chai.request(app)
      .post('/home/apply_json_patch')
      .send({})
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('JSON object and/or JSON patch array missing');
        done();
      });
  });
  it('POST /home/apply_json_patch should return a status 400 if only the JSON object is passed.', (done) => {
    chai.request(app)
      .post('/home/apply_json_patch')
      .send({
        obj: {
          user: 'tarang',
          passwd: 'barua'
        }
      })
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('JSON object and/or JSON patch array missing');
        done();
      });
  });
  it('POST /home/apply_json_patch should return a status 400 if only the JSON patch array is passed.', (done) => {
    chai.request(app)
      .post('/home/apply_json_patch')
      .send({
        patch: [
          { 'op': 'remove', 'path': '/user' },
          { 'op': 'remove', 'path': '/passwd' }
        ]
      })
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('JSON object and/or JSON patch array missing');
        done();
      });
  });
});
