import { Response } from "express";

export default function sendData<T>(res: Response, status: number, data: T) {
  return res.status(status).send(data);
}
