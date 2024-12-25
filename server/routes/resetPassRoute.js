import express from "express";
import { reqResetPass } from "../controller/resetPassController.js";
import { resetPassword } from "../controller/resetPassController.js";

const router = express.Router();

// request password reset route
router.post("/request-reset", reqResetPass);

// reset password route
router.post("/reset", resetPassword);

export default router;
