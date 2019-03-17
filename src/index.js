import express from "express";
import bodyParser from "body-parser";
import graphqlHttp from "express-graphql";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

import graphQlSchema from "../graphql/schema/index";
import graphQlResolvers from "../graphql/resolvers/index";
import config from "../config/config";
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

const PORT = process.env.PORT || 3000;

mongoose
  .connect(config.DATABASE_CLUSTER_URL, { useNewUrlParser: true })
  .then(() => app.listen(PORT))
  .catch(err => {
    throw err;
  });
