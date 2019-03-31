/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const chai = require("chai");
const chalk = require("chalk");

const { expect } = chai;
const request = require("supertest")("localhost:3000/api/v1/graphql");
const responseHelper =  require("../helpers/producer-helper");

// Tests for Users
describe(chalk.inverse("User Tests:"), () => {

  // Tests for Food Consumers
  describe("Food Consumers Tests:", () => {
    it("Return all consumers [Type = Array]", done => {
      request
        .get("/")
        .send({ query: "{ consumers { email } }" })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.consumers).to.be.an("array");
          done();
        });
    });
    it("Try to create consumer that exist in db [Get \"Already exist\" message]", done => {
      request
        .post("/")
        .send({
          query:
            'mutation {' +
              'createConsumer(consumerInput: {email: "someemail@yandex.ru", password: "somepass"}) { email }' +
            '}'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.errors.message).to.equal(
            responseHelper.CONSUMER_ALREADY_EXISTS
          );
          done();
        });
    });
    it("Try to create consumer via Google [Get \"Wrong token\" message]", done => {
      request
        .post("/")
        .send({
          query:
            'mutation { createConsumerGoogle { email } }'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.errors.message).to.equal(
            responseHelper.GOOGLE_ACCOUNT_TOKEN_NOT_VALID
          );
          done();
        });
    });
  });

  // Tests for Food Producers
  describe("Food Producers Tests:", () => {
    it("Return all producers [Type = Array]", done => {
      request
        .get("/")
        .send({ query: "{ producers { email } }" })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.producers).to.be.an("array");
          done();
        });
    });
    it("Try to create producer that exist in db [Get \"Already exist\" message]", done => {
      request
        .post("/")
        .send({
          query:
            "mutation {" +
            'createProducer(producerInput: {email: "someemail@yandex.ru", password: "somepass"}) { email }' +
            "}"
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.errors.message).to.equal(
            responseHelper.PRODUCER_ALREADY_EXISTS
          );
          done();
        });
    });
    it("Try to create producer via Google [Get \"Wrong token\" message]", done => {
      request
        .post("/")
        .send({
          query:
            'mutation { createProducerGoogle { email } }'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.errors.message).to.equal(
            responseHelper.GOOGLE_ACCOUNT_TOKEN_NOT_VALID
          );
          done();
        });
    });
  });

});
