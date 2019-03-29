import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import graphqlHttp from "express-graphql";
import path from "path";
import config from "../config/config";

import graphQlSchema from "../graphql/schema/index";
import graphQlResolvers from "../graphql/resolvers/index";
import isAuth from "../middleware/is-auth";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(isAuth);

app.use(
  `${config.ROOT_ENDPOINT}/${config.API_VERSION}/${config.GRAPHQL_ENDPOINT}`,
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

module.exports = app;
