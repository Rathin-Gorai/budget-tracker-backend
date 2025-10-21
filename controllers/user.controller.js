import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
/**
 * POST /user/login
 * Login using Email and Password
 */
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        return res.status(200).json({ message: "Login successful", data: token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * POST /user/register
 * Register a new user using Email and Password and generate a JWT token
 */

export const userRegister = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // check if user already exists
        const user = await db.User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = await db.User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            created_at: new Date()
        });

        // generate token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        return res.status(201).json({ message: "User created", data: token });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * GET /user/
 * Get user data from JWT token
 */

export const getUserData = async (req, res) => {
    try {
        const user = await db.User.findOne({
            where: { id: req.user.id },
            attributes: { exclude: ["password", "created_at", "updated_at"] }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User found", data: user });
    } catch (error) {
        console.error("Get user data error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};