import express from "express";
import { postAnswer } from "../controller/answerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Post Answers for a Question
router.post("/",authMiddleware, postAnswer);

export default router;
