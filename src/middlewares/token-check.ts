import { Handler } from "express";

import sendError from "../utils/error-handle";

import admin from "firebase-admin";

import serviceAccount from "../configs/firebase";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  }),
});

const clientToken: Handler = async (req, res, next) => {
  try {
    res.locals.permissions = {
      student: false,
      hostelOffice: false,
    };
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1];
    if (!(token === undefined || token === "undefined")) {
      admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
          if (decodedToken && decodedToken.email_verified) {
            if (
              decodedToken?.email?.slice(decodedToken.email.length - 10) !==
              "iith.ac.in"
            ) {
              res.locals.user = {};
              return next();
            }
            res.locals.user = {
              uid: decodedToken.uid,
              email: decodedToken.email,
              name: decodedToken.name,
            };
            return next();
          } else {
            res.locals.user = {};
            return next();
          }
        })
        .catch((err) => {
          res.locals.user = {};
          console.error(err);
          return next();
        });
    } else {
      res.locals.user = {};
      return next();
    }
    return;
  } catch (err) {
    return sendError(res, 400, err);
  }
};

export default clientToken;
