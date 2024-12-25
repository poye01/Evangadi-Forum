// Required modules
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dbConnection from "../config/dbConfig.js";
import dotenv from "dotenv";
import { console } from "inspector";
dotenv.config();
// Configure Nodemailer
const EmailUser = process.env.EMAIL_USER;
const EmailUserPassword = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: EmailUser,
    pass: EmailUserPassword,
  },
});

// Endpoint to request password reset
export async function reqResetPass(req, res) {
  const { email } = req.body;

  try {
    const [rows] = await dbConnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random OTP
    const otp = crypto.randomInt(100000, 999999);
    const createdAt = Date.now();

    // Store OTP in a temporary table or memory (for simplicity, using in-memory here)
    await dbConnection.query(
      "INSERT INTO otps (email, otp, created_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, created_at = ?",
      [email, otp, createdAt, otp, createdAt]
    );

    // Send OTP via email
    await transporter.sendMail({
      from: EmailUser,
      to: email,
      subject: "Password Reset OTP",
      text: `
Dear ${rows[0].username},

We received a request to reset the password for your account associated with this email address. To proceed, please use the following One-Time Password (OTP):

${otp}

This OTP is valid for the next [2 minutes]. If you did not request a password reset, please ignore this email or contact our support team immediately.

For your security, please do not share this OTP with anyone.

To complete the process, enter the OTP on the password reset page and follow the instructions provided.

If you have any questions or need assistance, feel free to reach out to us.

Best regards,
Evangadi Forum
mikiastadessemiki@gmail.com

`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
}

// Endpoint to reset password
export async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  try {
    const [rows] = await dbConnection.execute(
      "SELECT * FROM otps WHERE email = ? AND otp = ?",
      [email, otp]
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check OTP expiry
    const OTP_EXPIRY = 2 * 60 * 1000; // 2 minutes in milliseconds
    if (Date.now() - rows[0].created_at > OTP_EXPIRY) {
      await dbConnection.execute("DELETE FROM otps WHERE email = ?", [email]);
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Encrypt the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await dbConnection.execute(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    // Clear OTP after successful reset
    await dbConnection.execute("DELETE FROM otps WHERE email = ?", [email]);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password" });
  }
}
