import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";
import mongoose from "mongoose";

// Create a new course
export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const { image } = req.files;
    const allowedFormats = ["image/png", "image/jpeg"];
    
    if (!allowedFormats.includes(image.mimetype)) {
      return res.status(400).json({ error: "Invalid file format. Only PNG and JPG allowed" });
    }

    // Upload image to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloudResponse || cloudResponse.error) {
      return res.status(500).json({ error: "Error uploading image" });
    }

    const course = await Course.create({
      title,
      description,
      price,
      image: { public_id: cloudResponse.public_id, url: cloudResponse.url },
      creatorId: adminId,
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an existing course
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body;

  try {
    const course = await Course.findOne({ _id: courseId, creatorId: adminId });
    
    if (!course) {
      return res.status(404).json({ error: "Course not found or unauthorized" });
    }

    // Update course data
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;

    if (req.files?.image) {
      // Delete old image from Cloudinary
      if (course.image?.public_id) {
        await cloudinary.uploader.destroy(course.image.public_id);
      }

      // Upload new image
      const cloudResponse = await cloudinary.uploader.upload(req.files.image.tempFilePath);
      if (!cloudResponse || cloudResponse.error) {
        return res.status(500).json({ error: "Error uploading new image" });
      }
      course.image = { public_id: cloudResponse.public_id, url: cloudResponse.url };
    }

    await course.save();
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete an existing course
export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;

  try {
    const course = await Course.findOneAndDelete({ _id: courseId, creatorId: adminId });

    if (!course) {
      return res.status(404).json({ error: "Course not found or unauthorized" });
    }

    // Delete image from Cloudinary
    if (course.image?.public_id) {
      await cloudinary.uploader.destroy(course.image.public_id);
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get details of a specific course
export const courseDetails = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Purchase a course
import Stripe from "stripe";
import config from "../routes/config.js";
const stripe=new Stripe(config.STRIPE_SECRET_KEY);

export const buyCourse = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;


  if (!userId) {
    return res.status(401).json({ errors: "User is not authenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ errors: "Invalid course ID format" });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ errors: "User has already purchased this course" });
    }

    // Stripe payment process
    const amount = course.price * 100; // Convert to cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });


    // ✅ Save the purchase in the database
    const newPurchase = new Purchase({
      userId,
      courseId,
      paymentIntentId: paymentIntent.id, // Save Stripe payment ID
      status: "paid",
    });

    await newPurchase.save(); // Save to MongoDB

    return res.status(201).json({
      message: "Course purchased successfully!",
      paymentIntent,
    });
  } catch (error) {
    console.error("Error in course purchase:", error);
    return res.status(500).json({ errors: "Internal Server Error" });
  }
};