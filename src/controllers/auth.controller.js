import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "crypto";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { isMailConfigured, sendPasswordResetEmail } from "../utils/mailer.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    if (String(password).length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
      return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password,
    });

    res.status(201).json({
      message: "Account created successfully",
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err); 
    res.status(err.code === 11000 ? 409 : 500).json({
      message: err.code === 11000 ? "Email already registered" : "Server error during registration",
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const token = generateToken(user); 
  
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const requestPasswordReset = async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!isMailConfigured()) {
    return res.status(503).json({ message: "Password reset email is not configured on the server yet." });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = randomBytes(32).toString("hex");
      user.passwordResetToken = createHash("sha256").update(token).digest("hex");
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/, "");
      try {
        await sendPasswordResetEmail({
          to: user.email,
          resetUrl: `${frontendUrl}/reset-password?token=${token}`,
        });
      } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        throw error;
      }
    }

    return res.status(200).json({
      message: "If an account exists for that email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Password reset email failed:", error.message);
    return res.status(500).json({ message: "Unable to send a password reset email right now." });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) {
    return res.status(400).json({ message: "Reset token and new password are required" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const passwordResetToken = createHash("sha256").update(String(token)).digest("hex");
    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) return res.status(400).json({ message: "This password reset link is invalid or expired." });

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully. Please log in with your new password." });
  } catch (error) {
    console.error("Password reset failed:", error.message);
    return res.status(500).json({ message: "Unable to reset password right now." });
  }
};
