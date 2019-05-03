/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const chai = require("chai");
const chalk = require("chalk");

const { expect } = chai;
const request = require("supertest")("localhost:3000/api/v1/graphql");
const responseHelper = require("../helpers/producer-helper");

// Tests for Orders
describe(chalk.inverse("Orders Tests:"), () => {

  let token;

  before(done => {
    request
      .get("/")
      .send({
        query:
          '{ producerLogin(email: "someemail@yandex.ru", password: "somepass") { token } }'
      })
      .expect(200)
      .end((err, res) => {
        ({ token } = res.body.data.producerLogin);
        done();
      });
  });

  it('Create new order [on "Жареные гвозди" dish]', done => {
    request
      .post("/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query:
          'mutation { createOrder(dishesIds: [ "5ca322541d76760031d388cf" ]) { dishes { _id, name } } }'
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.createOrder.name).to.equal("Жареные гвозди");
        done();
      });
  });

});