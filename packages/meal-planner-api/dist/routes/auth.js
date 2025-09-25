"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const api_error_1 = require("../utils/api-error");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET;
// Register
router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log('username = ' + username);
        console.log('password = ' + password);
        if (!username || !password) {
            return next(new api_error_1.ApiError('USENAME_AND_PASSWORD_REQUIRED'));
        }
        const existingUser = await user_model_1.default.findOne({ username });
        if (existingUser)
            next(new api_error_1.ApiError('USER_EXISTS'));
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.default({ username, password: hashedPassword });
        await newUser.save();
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '2h' });
        res.status(201).json({ token, message: 'User registered successfully' });
    }
    catch (error) {
        console.error('Register error:', error);
        return next(new api_error_1.ApiError('INTERNAL_SERVER_ERROR'));
    }
});
// Login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await user_model_1.default.findOne({ username });
        if (!user)
            return next(new api_error_1.ApiError('USER_NOT_FOUND'));
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return next(new api_error_1.ApiError('INVALID_CREDENTIALS'));
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    }
    catch (err) {
        return next(new api_error_1.ApiError('INTERNAL_SERVER_ERROR'));
        // res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
