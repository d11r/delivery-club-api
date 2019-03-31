/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const chai = require("chai");
const chalk = require("chalk");

const { expect } = chai;
const request = require("supertest")("localhost:3000/api/v1/graphql");

// Tests for Dishes
describe(chalk.inverse("Dishes Tests:"), () => {
  it("Return all dishes [Type = Array]", done => {
    request
      .get("/")
      .send({ query: "{ dishes { name } }" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.dishes).to.be.an("array");
        done();
      });
  });
});