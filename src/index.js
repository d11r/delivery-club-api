import express from "express";
import bodyParser from "body-parser";
import graphqlHttp from "express-graphql";
import mongoose from "mongoose";
import { buildSchema } from "graphql";

import config from "../config/config";

const app = express();

const dishes = [];

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
      dishes: () => dishes,
      createDish: args => {
        const newDish = {
          _id: Math.random().toString(),
          name: args.dishInput.name,
          description: args.dishInput.description,
          price: +args.dishInput.price
        };
        dishes.push(newDish);
        return newDish;
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(config.DATABASE_CLUSTER_URL, { useNewUrlParser: true })
  .then(() => app.listen(3000))
  .catch(err => {
    throw new Error(err);
  });
