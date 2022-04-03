import { createPool } from "mysql";

export const pool = createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ? process.env.DB_PORT : "3000"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATA_DB,
  multipleStatements: true,
});
