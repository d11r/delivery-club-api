/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const chai = require("chai");

const { expect } = chai;
const request = require("supertest")("localhost:3000/api/v1/graphql");

describe("user tests", () => {
  describe("producer tests", () => {
    it("should return all producers (in our case 5)", done => {
      request
        .get("/")
        .send({ query: "{ producers { email } }" })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.producers).to.be.an("array");
          expect(res.body.data.producers).to.have.lengthOf(5);
          done();
        });
    });
  });
});
