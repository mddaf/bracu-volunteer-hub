import express from "express";
import bcryptjs from "bcryptjs";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { User } from "../models/user.model.js"; // Import JWT utility function

const router = express.Router();

// Check if email exists and create role if it doesn't
router.post("/check-email", async (req, res) => {
    const { email, name, password, role } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ exists: true, message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Generate a verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create a new user with the provided role
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            role,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        // Save the new user to the database
        await newUser.save();

        // Generate JWT and set it as a cookie
        generateTokenAndSetCookie(res, newUser._id);

        res.status(201).json({ exists: false, message: "Role created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Failed to create role", error: error.message });
    }
});

export default router;