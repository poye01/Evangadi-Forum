import { StatusCodes } from "http-status-codes";
import dbConnection from "../config/dbConfig.js";

// Post Answers for a Question
export async function postAnswer(req, res) {
  const { userid, answer, questionid } = req.body;

  // Validate required fields
  if (!userid || !answer || !questionid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide answer",
    });
  }

  // Get the current timestamp and adjust to UTC+3
  const currentTimestamp = new Date();
  const adjustedDate = new Date(
    currentTimestamp.getTime() + 3 * 60 * 60 * 1000
  );
  const formattedTimestamp = adjustedDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    // Check for duplicate entries in the `answers` table
    const [existingAnswer] = await dbConnection.query(
      "SELECT * FROM answers WHERE userid = ? AND questionid = ?",
      [userid, questionid]
    );

    if (existingAnswer.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        error: "Conflict",
        message: "You have already provided an answer for this question.",
      });
    }

    // Insert the new answer
    await dbConnection.query(
      "INSERT INTO answers (userid, answer, questionid, createdAt) VALUES (?, ?, ?, ?)",
      [userid, answer, questionid, formattedTimestamp]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully.",
    });
  } catch (err) {
    console.error("Database error:", err);

    // Handle specific database errors
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(StatusCodes.CONFLICT).json({
        error: "Conflict",
        message: "Duplicate entry detected. Unable to insert answer.",
      });
    }

    // Handle general errors
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}
