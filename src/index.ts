import express, { json, urlencoded, static as staticServer } from "express";
import "./env";
import logger from "morgan";
import path, { dirname } from "path";

import cors from "cors";

import StudentRouter from "./routes/student";
import HostelRouter from "./routes/hostel";
import clientToken from "./middlewares/token-check";

import { fileURLToPath } from "url";
import { setPermission } from "./middlewares/setPermissions";
import { checkStudent } from "./middlewares/checkStudent";
import { checkHostelOffice } from "./middlewares/checkHostelOffice";
import sendData from "./utils/send-data";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());

if (process.env.NODE_ENV !== "production") {
  console.log("__DEV__");
  app.use(logger("dev"));
} else {
  app.use(logger("tiny"));
}

app.use(json());
app.use(urlencoded({ extended: false }));
app.get("/getrole", clientToken, setPermission, async (_req, res) => {
  return sendData(res, 200, res.locals.permissions);
});
app.use("/student", clientToken, setPermission, checkStudent, StudentRouter);
app.use("/hostel", clientToken, setPermission, checkHostelOffice, HostelRouter);
app.use(staticServer(path.join(__dirname, "public")));

app.listen(parseInt(process.env.PORT || "3000"), () => {
  console.log(`Server started on port ${process.env.PORT || "3000"}`);
});
