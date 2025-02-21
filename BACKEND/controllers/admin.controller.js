import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dotenv from "dotenv";
import { Admin } from "../models/admin.model.js";
import config from "../routes/config.js";

dotenv.config(); // Load environment variables

// Admin Signup Controller
export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const adminSchema = z.object({
    firstName: z.string().min(3, { message: "First name must be at least 3 characters long" }),
    lastName: z.string().min(3, { message: "Last name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  });

  const validatedData = adminSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res.status(400).json({ errors: validatedData.error.issues.map(err => err.message) });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ errors: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ firstName, lastName, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Signup successful", admin: newAdmin });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(403).json({ errors: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id }, config.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Enable in production (HTTPS)
      sameSite: "Strict", // Protects against CSRF
    });

    res.status(200).json({ message: "Login successful", admin, token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin Logout Controller
export const logout = (req, res) => {
  try {
    if (!req.cookies || !req.cookies.jwt) {
      return res.status(401).json({ errors: "Not authenticated" });
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
