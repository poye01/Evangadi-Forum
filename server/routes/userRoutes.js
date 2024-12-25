import express from "express";
import { register, login, check } from "../controller/usercontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router(); // Using router instead of app on the server

// Register route
router.post("/register", register);

// Login users
router.post("/login", login);

// Check users
router.get("/check", authMiddleware, check);

export default router;
