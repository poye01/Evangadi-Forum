import express from "express";
import {
  postQuestion,
  getAllQuestions,
  getQuestionAndAnswer,
} from "../controller/questionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all questions
router.get("/", authMiddleware, getAllQuestions);

// Get single question
router.get("/:questionId", authMiddleware, getQuestionAndAnswer);

// Post a question
router.post("/",authMiddleware, postQuestion);

export default router;
