import { pool } from "../configs/db";

import { Handler } from "express";

export const checkHostelOffice: Handler = async (_req, res, next) => {
  if (res.locals.user) {
    pool.query(
      `SELECT email FROM hostel_office WHERE email = $1 ;`,
      [res.locals.user.email],
      (err, results) => {
        if (err) {
          console.error(err);
          return next;
        }
        if (results.rows.length === 1) {
          res.locals.permissions.hostelOffice = true;
          return next;
        }
        return next;
      }
    );
    return;
  } else {
    return next;
  }
};
