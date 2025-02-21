import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { User } from "../models/user.models.js";
import { z } from "zod";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

config(); // Load environment variables

// User Signup
export const signup = async (req, res) => {
  const userSchema = z.object({
    firstName: z.string().min(3, "First name must be at least 3 characters long"),
    lastName: z.string().min(3, "Last name must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  const validateData = userSchema.safeParse(req.body);
  if (!validateData.success) {
    return res.status(400).json({ errors: validateData.error.issues.map((err) => err.message) });
  }

  try {
    const { firstName, lastName, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ errors: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ firstName, lastName, email, password: hashedPassword });

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({ errors: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 604800000 });

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// User Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get User Purchases
export const purchases = async (req, res) => {
  try {
    const purchased = await Purchase.find({ userId: req.userId }).populate("courseId");
    res.status(200).json({ purchased });
  } catch (error) {
    console.error("Error in fetching purchases:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
