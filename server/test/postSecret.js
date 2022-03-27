process.env.NODE_ENV = 'test';

let app = require('../index.js');
let assert = require('assert');
let chai = require('chai');
let should = chai.should();
let request = require('supertest');
let mongoose = require("mongoose");
const db = require("../app/models");
const Secret = db.secrets;

//TESTS FOR ROUTE /secret

describe('POST /secret', function () {
    it('It should store secret, respond with json, return status 200', function (done) {
        request(app)
            .post('/secret')
            .send({ secret: 'My test secret', expireAfter: 30 })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.body.should.have.property('message').eql('successful operation');
                res.body.should.be.a('object');
                res.body.data.should.have.property('hash');
                res.body.data.should.have.property('secretText');
                res.body.data.should.have.property('expiresAt');
                res.body.data.should.have.property('createdAt');
                done();
            });
    });
});

describe('POST /secret', function () {
    it('It should store secret with no expiry when expiresAfter is 0', function (done) {
        request(app)
            .post('/secret')
            .send({ secret: 'My test secret', expireAfter: 0 })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.body.should.have.property('message').eql('successful operation');
                res.body.should.be.a('object');
                res.body.data.should.have.property('hash');
                res.body.data.should.have.property('secretText');
                res.body.data.should.have.property('expiresAt').eql(null);
                res.body.data.should.have.property('createdAt');
                done();
            });
    });
});

describe('POST /secret', function () {
    it('It should NOT store secret if expiry is invalid', function (done) {
        request(app)
            .post('/secret')
            .send({ secret: 'My test secret', expireAfter: -1 })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(405)
            .end(function (err, res) {
                res.body.should.have.property('message').eql('Invalid input');
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('POST /secret', function () {
    it('It should NOT store secret if secret text is not defined', function (done) {
        request(app)
            .post('/secret')
            .send({ secret: '', expireAfter: 30 })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(405)
            .end(function (err, res) {
                res.body.should.have.property('message').eql('Invalid input');
                res.body.should.be.a('object');
                done();
            });
    });
});


//TESTS FOR ROUTE /secret/:hash

describe('GET /secret', () => {
    it('It should NOT get a secret, return status 405 when hash length is imvalid', function (done) {
        const hash = "baadhassh";
        request(app)
            .get(`/secret/${hash}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(405)
            .end(function (err, res) {
                res.body.should.have.property('message').eql('Invalid input');
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('GET /secret', () => {
    it('It should NOT get a secret, return status 404, when hash gets no match', function (done) {
        // invalid hash. 
        const hash = "aaaaaaaaaaaaaaaa";
        request(app)
            .get(`/secret/${hash}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                res.body.should.have.property('message').eql('Secret not found');
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('GET /secret/:hash', () => {
    it('it should NOT get a secret if it has expired', (done) => {
        let secret = new Secret({ secretText: 'My expired secret text', expiresAt: new Date() });
        secret.save((err, secret) => {
            //Decrypt secret
            secret.decryptFieldsSync();
            request(app)
                .get(`/secret/${secret.hash}`)
                .send(secret)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end(function (err, res) {
                    res.body.should.have.property('message').eql('Secret not found');
                    res.body.should.be.a('object');
                    done();
                });
        });

    });
});

describe('GET /secret/:hash', () => {
    it('it should GET a secret by the hash from created secret when it has not expired', (done) => {
        let secret = new Secret({ secretText: 'My other secret text', expiresAt: null });
        secret.save((err, secret) => {
            //Decrypt secret
            secret.decryptFieldsSync();
            request(app)
                .get(`/secret/${secret.hash}`)
                .send(secret)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    res.body.should.have.property('message').eql('successful operation');
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('secretText');
                    res.body.data.should.have.property('expiresAt');
                    res.body.data.should.have.property('createdAt');
                    done();
                });
        });

    });
});

//TESTS FOR INVALID ROUTES

describe('GET /secrt', () => {
    it('it should Return 404 with message Invalid Route', (done) => {
        request(app)
            .get(`/secrt`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
                res.body.should.have.property('message').eql('Invalid Route');
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('POST /secrt', function () {
    it('it should Return 404 with message Invalid Route', function (done) {
        request(app)
            .post('/secrt')
            .send({ secret: '', expireAfter: 30 })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                res.body.should.have.property('message').eql('Invalid Route');
                res.body.should.be.a('object');
                done();
            });
    });
});