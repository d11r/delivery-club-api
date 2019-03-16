import express from "express";
import bodyParser from "body-parser";
import graphqlHttp from "express-graphql";
import { buildSchema } from "graphql";

import config from "../config/config";

const app = express();

app.use(bodyParser.json());
app.use(
  `${config.ROOT_ENDPOINT}/${config.API_VERSION}/${config.GRAPHQL_ENDPOINT}`,
  graphqlHttp({
    schema: buildSchema(`
      type RootQuery {
        users: [String!]!
      }

      type RootMutation {
        createUser(name: String): String
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      users: () => ["ezio", "daniil", "vlad"],
      createUser: args => args.name
    },
    graphiql: true
  })
);

app.listen(3000);
