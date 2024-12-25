import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Unauthorized",
      message: "Authentication invalid",
    });
  }

  try {
    // Extract the token if the format is 'Bearer <token>'
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    const { username, userid } = jwt.verify(token, secret);

    // Attach user info to the request object
    req.user = { username, userid };

    // Call next middleware
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Unauthorized",
      message: "Authentication invalid",
    });
  }
}

export default authMiddleware;
