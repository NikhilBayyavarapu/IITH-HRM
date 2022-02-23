import { Handler } from "express";

import sendError from "../utils/error-handle";

const clientToken: Handler = async (_req, res, next) => {
  try {
    return next();
  } catch (err) {
    return sendError(res, 400, err);
  }
};

export default clientToken;
