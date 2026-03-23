"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const api_error_1 = require("../utils/api-error");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET;
// Register
router.post('/register', async (req, res, next) => {
    try {
        console.log(req.body);
        const { email, name, password } = req.body;
        // 🔹 1. Validate input
        if (!email || !password || !name) {
            return next(new api_error_1.ApiError('EMAIL_NAME_AND_PASSWORD_REQUIRED'));
        }
        // 🔹 2. Check if user already exists
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return next(new api_error_1.ApiError('USER_EXISTS'));
        }
        // 🔹 3. Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // 🔹 4. Create and save new user
        const newUser = new user_model_1.User({
            email,
            name,
            password: hashedPassword,
        });
        await newUser.save();
        // 🔹 5. Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '2h' });
        // 🔹 6. Prepare user data for frontend
        const userResponse = {
            id: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
        };
        // 🔹 7. Send response
        return res.status(201).json({
            user: userResponse,
            token,
            message: 'User registered successfully',
        });
    }
    catch (error) {
        console.error('Register error:', error);
        return next(new api_error_1.ApiError('INTERNAL_SERVER_ERROR'));
    }
});
// Login
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // 🔹 1. Check if user exists
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return next(new api_error_1.ApiError('USER_NOT_FOUND'));
        }
        // 🔹 2. Validate password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return next(new api_error_1.ApiError('INVALID_CREDENTIALS'));
        }
        // 🔹 3. Generate JWT
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
        // 🔹 4. Prepare safe user object for frontend (no password)
        const userResponse = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
        };
        // 🔹 5. Send response
        return res.status(200).json({
            user: userResponse,
            token,
            message: 'Login successful',
        });
    }
    catch (err) {
        console.error('Login error:', err);
        return next(new api_error_1.ApiError('INTERNAL_SERVER_ERROR'));
    }
});
exports.default = router;
