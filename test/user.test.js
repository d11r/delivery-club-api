/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const chai = require("chai");
const chalk = require("chalk");

const { expect } = chai;
const request = require("supertest")("localhost:3000/api/v1/graphql");

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
          // expect(res.body.data.consumers).to.have.lengthOf(5);
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
          // expect(res.body.data.producers).to.have.lengthOf(5);
          done();
        });
    });
  });

});
