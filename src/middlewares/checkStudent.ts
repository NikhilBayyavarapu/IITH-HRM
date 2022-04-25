import { Handler } from "express";
import sendError from "../utils/error-handle";

export const checkStudent: Handler = async (_req, res, next) => {
  if (res.locals.permissions.student) {
    return next;
  }
  return sendError(res, 403, "No access");
};
