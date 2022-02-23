import express, { json, urlencoded, static as staticServer } from "express";
import "./env";
import logger from "morgan";
import path, { dirname } from "path";

import IndexRouter from "./routes/index";
import clientToken from "./middlewares/token-check";

import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

if (process.env.NODE_ENV !== "production") {
  console.log("__DEV__");
  app.use(logger("dev"));
} else {
  app.use(logger("tiny"));
}

app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/", clientToken, IndexRouter);
app.use(staticServer(path.join(__dirname, "public")));

app.listen(parseInt(process.env.PORT || "3000"), () => {
  console.log(`Server started on port ${process.env.PORT || "3000"}`);
});
