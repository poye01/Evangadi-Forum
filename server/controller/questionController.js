import { StatusCodes } from "http-status-codes";
import dbConnection from "../config/dbConfig.js";
import crypto from "crypto";

// Post questions / ask questions
export async function postQuestion(req, res) {
  const { userid, title, description, tag } = req.body;
  // Create a new date object and adjust for UTC+3
  const currentTimestamp = new Date();
  const adjustedDate = new Date(
    currentTimestamp.getTime() + 3 * 60 * 60 * 1000
  );

  // Format the date as 'YYYY-MM-DD HH:mm:ss'
  const formattedTimestamp = adjustedDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  if (!userid || !title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  const questionid = crypto.randomBytes(10).toString("hex");

  try {
    await dbConnection.query(
      "INSERT INTO questions (questionid, userid, title, description, tag, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [questionid, userid, title, description, tag, formattedTimestamp]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Question posted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later: " + err,
    });
  }
}

// Get all questions
export async function getAllQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query(`SELECT
        q.questionid,
        q.title,
        q.description, 
        q.createdAt, 
        u.username 
        FROM questions q   
        INNER JOIN users u ON q.userid = u.userid  
        ORDER BY q.createdAt DESC`);
    return res.status(StatusCodes.OK).json({
      questions: questions,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later" });
  }
}

// Get single question and answers
export async function getQuestionAndAnswer(req, res) {
  const questionid = req.params.questionId;

  try {
    const [rows] = await dbConnection.query(
      `SELECT 
          q.questionid, 
          q.title, 
          q.description, 
          q.createdAt AS question_createdAt,
          u2.username AS question_username,
          a.answerid, 
          a.userid AS answer_userid, 
          a.answer,
          a.createdAt,
          u.username AS answer_username
       FROM 
          questions q   
       LEFT JOIN 
          answers a ON q.questionid = a.questionid
       LEFT JOIN 
          users u ON u.userid = a.userid
       LEFT JOIN 
          users u2 ON u2.userid = q.userid
       WHERE 
          q.questionid = ?
       ORDER BY 
          a.createdAt DESC`,
      [questionid]
    );

    // Check if the question exists
    if (rows.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Question not found" });
    }

    // Reshape the data to include answers under the question
    const questionDetails = {
      id: rows[0].questionid,
      title: rows[0].title,
      description: rows[0].description,
      qtn_createdAt: rows[0].question_createdAt,
      qtn_username: rows[0].question_username,
      answers: rows
        .map((answer) => ({
          answerid: answer.answerid,
          userid: answer.answer_userid,
          username: answer.answer_username,
          answer: answer.answer,
          createdAt: answer.createdAt,
        }))
        .filter((answer) => answer.answerid !== null), // Filter out any null answers
    };
    return res.status(StatusCodes.OK).json(questionDetails);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching question details: " + error });
  }
}
