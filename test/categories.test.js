/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const chai = require("chai");
const chalk = require("chalk");

const { expect } = chai;
const request = require("supertest")("localhost:3000/api/v1/graphql");

// Tests for Categories
describe(chalk.inverse("Categories Tests:"), () => {
  it("Return all categories [Type = Array]", done => {
    request
      .get("/")
      .send({ query: "{ categories { name } }" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.categories).to.be.an("array");
        // expect(res.body.data.categories).to.have.lengthOf(5);
        done();
      });
  });
});