import { Handler } from "express";
import sendError from "../utils/error-handle";

export const checkHostelOffice: Handler = async (_req, res, next) => {
  if (res.locals.permissions.hostelOffice) {
    return next();
  }
  return sendError(res, 403, "No access");
};
