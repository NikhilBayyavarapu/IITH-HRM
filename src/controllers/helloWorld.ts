import { Handler } from "express";
import sendData from "../utils/send-data";

export const helloWorld: Handler = async function (_req, res) {
  sendData(res, 200, "Hello World");
};
