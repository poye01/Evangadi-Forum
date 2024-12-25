import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const dbConnection = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  connectionLimit: process.env.CONNECTION_LIMIT,
  port: process.env.DB_PORT,
});

export default dbConnection.promise();
