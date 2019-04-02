/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import Producer from "../models/users/producer";
import Consumer from "../models/users/consumer";

import config from "../config/config";

const client = new OAuth2Client(config.CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.CLIENT_ID
  });
  return ticket.getPayload();
}

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (req.body.token) {
    const payload = await verify(req.body.token).catch(_ => {
      req.isAuth = false;
      return next();
    });

    if (Math.round(Date.now() / 1000) > payload.exp) {
      req.isAuth = false;
      req.tokenExpired = true;
      return next();
    }

    req.isAuth = true;
    req.userEmail = payload.email;
    req.userName = payload.name;

    // populate user's id
    const user = await Producer.findOne({ email: req.userEmail });
    if (user) {
      req.user_id = user.id;
    } else {
      const consumer = await Consumer.findOne({ email: req.userEmail });
      if (consumer) {
        req.user_id = consumer.id;
      }
    }

    return next();
  }

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.SECRET_KEY);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.user_id = decodedToken.user_id;
  req.userEmail = decodedToken.email;
  return next();
};
