import { Response } from "express";

export default function sendError<T>(res: Response, status: number, err: T) {
  console.error(`Error: ${err}`);
  return res.status(status).send(err);
}
