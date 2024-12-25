import dbConnection from "../config/dbConfig.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// signup controller
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  const currentTimestamp = new Date();
  currentTimestamp.setHours(currentTimestamp.getHours() + 3); // Adjusting for specific timezone known as UTC+3
  const formattedTimestamp = currentTimestamp
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  // Check if all required fields are provided
  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }
  // Check if password is at least 8 characters long
  if (password.length < 8) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Password must be at least 8 characters",
    });
  }
  try {
    // Check if the username or email already exists
    const [user] = await dbConnection.query(
      "SELECT username, userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (user.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        error: "Conflict",
        message: "User already existed",
      });
    }

    // Encrypting the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword, formattedTimestamp]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// signin controller
async function login(req, res) {
  const { usernameOrEmail, password } = req.body;

  // Check if email and password are provided
  if (!usernameOrEmail || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    // Query the user by email or username
    const [user] = await dbConnection.query(
      "SELECT username, userid, password FROM users WHERE email = ? OR username = ?",
      [usernameOrEmail, usernameOrEmail]
    );

    // Check if user exists
    if (user.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Unauthorized",
        message: "Invalid username or password",
      });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Unauthorized",
        message: "Invalid username or password",
      });
    }

    // Generate JWT token
    const username = user[0].username;
    const userid = user[0].userid;
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ username, userid }, secret, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Return the token and success message
    return res.status(StatusCodes.OK).json({
      message: "User login successful",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// check user controller
function check(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  return res.status(StatusCodes.OK).json({
    message: "Valid user",
    username,
    userid,
  });
}

export { login, register, check };
