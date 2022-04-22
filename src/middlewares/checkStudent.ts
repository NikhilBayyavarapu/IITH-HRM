import { pool } from "../configs/db";

import { Handler } from "express";

export const checkStudent: Handler = async (_req, res, next) => {
  if (res.locals.user) {
    pool.query(
      `SELECT name FROM student_details WHERE roll_no = $1 ;`,
      [
        res.locals.user.email
          .substring(0, res.locals.user.email.length - 11)
          .toUpperCase(),
      ],
      (err, results) => {
        if (err) {
          console.error(err);
          return next;
        }
        if (results.rows.length === 1) {
          res.locals.user.name = results.rows[0].name;
          res.locals.permissions.student = true;
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
