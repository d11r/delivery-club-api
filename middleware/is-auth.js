/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

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
  return next();
};
