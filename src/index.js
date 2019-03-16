/* eslint-disable no-underscore-dangle */
import express from "express";
import bodyParser from "body-parser";
import graphqlHttp from "express-graphql";
import mongoose from "mongoose";
import { buildSchema } from "graphql";

import config from "../config/config";
import Dish from "../models/dish";

const app = express();

app.use(bodyParser.json());
app.use(
  `${config.ROOT_ENDPOINT}/${config.API_VERSION}/${config.GRAPHQL_ENDPOINT}`,
  graphqlHttp({
    schema: buildSchema(`
      type Dish {
        _id: ID!
        name: String!
        description: String!
        price: Float!
      }

      input DishParams {
        name: String!
        description: String!
        price: Float!
      }

      type RootQuery {
        dishes: [Dish!]!
      }

      type RootMutation {
        createDish(dishInput: DishParams): Dish
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      dishes: () =>
        Dish.find()
          .then(dishes =>
            dishes.map(dish => ({
              ...dish._doc,
              _id: dish._doc._id.toString()
            }))
          )
          .catch(err => {
            throw err;
          }),
      createDish: args => {
        const dish = new Dish({
          name: args.dishInput.name,
          description: args.dishInput.description,
          price: +args.dishInput.price
        });
        dish
          .save()
          .then(result => ({
            ...result._doc,
            _id: dish._doc._id.toString()
          }))
          .catch(err => {
            throw err;
          });

        return dish;
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
