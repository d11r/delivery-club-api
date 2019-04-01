/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const chai = require("chai");
const chalk = require("chalk");

const { expect } = chai;
const request = require("supertest")("localhost:3000/api/v1/graphql");
const responseHelper = require("../helpers/producer-helper");

// Tests for Dishes [Unauthorized]
describe(chalk.inverse("Unauthorized Dishes Tests:"), () => {

  it('Return all dishes [Type = Array]', done => {
    request
      .get("/")
      .send({ 
        query:
         '{ dishes { name } }'
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.dishes).to.be.an("array");
        done();
      });
  });

  it('Try to create new dish without autorization ["Not authorized" error]', done => {
    request
      .post("/")
      .send({
        query:
          'mutation { createDish(dishInput: { name: "Test", description: "Some random text", price: 100 }) { name } }'
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors.message).to.equal(
          responseHelper.ACTION_NOT_AUTHORIZED
        );
        done();
      });
  });

});

// Tests for Dishes [Authorized]
describe(chalk.inverse("Authorized Dishes Tests:"), () => {

  let token;
  let createdDishID;
  let testCategoryID;

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

  before( done => {
    request
      .get("/")
      .send({ query: "{ categories { _id, name } }" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const categoriesArr = res.body.data.categories;
        expect(categoriesArr).to.be.an("array");
        testCategoryID = categoriesArr.find(category => category.name === "Test")._id;
        done();
      });
  });

  it('Create new dish with autorization ["Test" dish]', done => {
    request
      .post("/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query:
          'mutation { createDish(dishInput: { name: "Test", description: "Some random text", price: 100 }) { _id, name } }'
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.createDish.name).to.equal("Test");
        createdDishID = res.body.data.createDish._id;
        done();
      });
  });

  it('Update created "Test" dish ["UpdatedTest" dish]', done => {
    request
      .post("/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `mutation { updateDish(dishId: "${createdDishID}", dishInput: { name: "UpdatedTest" }) { name } }`
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.updateDish.name).to.equal("UpdatedTest");
        done();
      });
  });

  it('Add "UpdatedTest" dish to "Test" category ["UpdatedTest" is in "Test" category]', done => {
    request
      .post("/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `mutation { addDishToCategory(dishId: "${createdDishID}", categoryId: "${testCategoryID}") { name } }`
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.addDishToCategory.name).to.equal("UpdatedTest");
        done();
      });
  });

  it('Remove "UpdatedTest" dish ["UpdatedTest" dish]', done => {
    request
      .post("/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `mutation { removeDish(dishId: "${createdDishID}") { name } }`
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.removeDish.name).to.equal("UpdatedTest");
        done();
      });
  });

});