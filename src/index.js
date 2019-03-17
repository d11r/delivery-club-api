/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import express from "express";
import bodyParser from "body-parser";
import graphqlHttp from "express-graphql";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { buildSchema } from "graphql";

import config from "../config/config";

import responseHelper from "../helpers/producer-helper";
import Dish from "../models/dish";
import Producer from "../models/users/producer";
import Consumer from "../models/users/consumer";

const app = express();

app.use(bodyParser.json());

const dishes = dishIds => {
  return Dish.find({ _id: { $in: dishIds } })
    .then(dishObjects =>
      dishObjects.map(dish => ({
        ...dish._doc,
        _id: dish.id,
        creator: producer.bind(this, dish.creator)
      }))
    )
    .catch(err => {
      throw err;
    });
};

const producer = producerId => {
  return Producer.findById(producerId)
    .then(user => ({
      ...user._doc,
      _id: user.id,
      created_dishes: dishes.bind(this, user._doc.created_dishes)
    }))
    .catch(err => {
      throw err;
    });
};

app.use(
  `${config.ROOT_ENDPOINT}/${config.API_VERSION}/${config.GRAPHQL_ENDPOINT}`,
  graphqlHttp({
    schema: buildSchema(`
      type Dish {
        _id: ID!
        name: String!
        description: String!
        price: Float!
        creator: Producer!
      }

      type Producer {
        _id: ID!
        email: String!
        password: String
        business_address: String
        website_address: String
        phone_number: String
        created_dishes: [Dish!]
      }

      type Consumer {
        _id: ID!
        email: String!
        password: String
        first_name: String
        last_name: String
        address: String
        phone_number: String
      }

      input DishParams {
        name: String!
        description: String!
        price: Float!
      }

      input ProducerParams {
        email: String!
        password: String!
        business_address: String
        website_address: String
        phone_number: String
      }

      input ConsumerParams {
        email: String!
        password: String!
        first_name: String
        last_name: String
        address: String
        phone_number: String
      }

      type RootQuery {
        dishes: [Dish!]!
        producers: [Producer!]!
        consumers: [Consumer!]!
      }

      type RootMutation {
        createDish(dishInput: DishParams): Dish
        createProducer(producerInput: ProducerParams): Producer
        createConsumer(consumerInput: ConsumerParams): Consumer
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      dishes: () =>
        Dish.find()
          .then(listOfDishes =>
            listOfDishes.map(dish => ({
              ...dish._doc,
              _id: dish.id,
              creator: producer.bind(this, dish._doc.creator)
            }))
          )
          .catch(err => {
            throw err;
          }),
      consumers: () =>
        Consumer.find()
          .then(consumers =>
            consumers.map(consumer => ({
              ...consumer._doc,
              _id: consumer._doc._id.toString()
            }))
          )
          .catch(err => {
            throw err;
          }),
      producers: () =>
        Producer.find()
          .then(producers =>
            producers.map(prod => ({
              ...prod._doc,
              _id: prod._doc._id.toString(),
              created_dishes: dishes.bind(this, prod._doc.created_dishes)
            }))
          )
          .catch(err => {
            throw err;
          }),
      createDish: args => {
        const dish = new Dish({
          name: args.dishInput.name,
          description: args.dishInput.description,
          price: +args.dishInput.price,
          creator: "5c8d761aebdd113b6d46db5f"
        });

        let createdDish;
        return dish
          .save()
          .then(result => {
            createdDish = {
              ...result._doc,
              _id: result._doc._id.toString(),
              creator: producer.bind(this, result._doc.creator)
            };
            return Producer.findById("5c8d761aebdd113b6d46db5f");
          })
          .then(user => {
            if (!user) {
              throw new Error(responseHelper.PRODUCER_OF_DISH_DOESNT_EXIST);
            }
            user.created_dishes.push(dish);
            return user.save();
          })
          .then(_ => createdDish)
          .catch(err => {
            throw err;
          });
      },
      createProducer: args => {
        return Producer.findOne({ email: args.producerInput.email })
          .then(user => {
            if (user) {
              throw new Error(responseHelper.PRODUCER_ALREADY_EXISTS);
            }
            return bcrypt.hash(args.producerInput.password, 12);
          })
          .then(hashPassword => {
            const prod = new Producer({
              email: args.producerInput.email,
              password: hashPassword,
              phone_number: args.producerInput.phone_number,
              business_address: args.producerInput.business_address,
              website_address: args.producerInput.website_address
            });
            return prod.save();
          })
          .then(result => ({
            ...result._doc,
            _id: result._doc._id.toString()
          }))
          .catch(err => {
            throw err;
          });
      },
      createConsumer: args => {
        return Consumer.findOne({ email: args.consumerInput.email })
          .then(user => {
            if (user) {
              throw new Error(responseHelper.CONSUMER_ALREADY_EXISTS);
            }

            return bcrypt.hash(args.consumerInput.password, 12);
          })
          .then(hashPassword => {
            const consumer = new Consumer({
              email: args.consumerInput.email,
              password: hashPassword,
              first_name: args.consumerInput.first_name,
              last_name: args.consumerInput.last_name,
              address: args.consumerInput.address,
              phone_number: args.consumerInput.phone_number
            });
            return consumer.save();
          })
          .then(result => ({
            ...result._doc,
            _id: result._doc._id.toString()
          }))
          .catch(err => {
            throw err;
          });
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(config.DATABASE_CLUSTER_URL, { useNewUrlParser: true })
  .then(() => app.listen(3000))
  .catch(err => {
    throw err;
  });
