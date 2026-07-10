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
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
};
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
const buildUserResponse = (user) => ({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
});
// Register
router.post('/register', async (req, res, next) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !password || !name) {
            return next(new api_error_1.ApiError('EMAIL_NAME_AND_PASSWORD_REQUIRED'));
        }
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return next(new api_error_1.ApiError('USER_EXISTS'));
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.User({
            email,
            name,
            password: hashedPassword,
        });
        await newUser.save();
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);
        newUser.refreshToken = refreshToken;
        await newUser.save();
        return res.status(201).json({
            user: buildUserResponse(newUser),
            accessToken,
            refreshToken,
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
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return next(new api_error_1.ApiError('USER_NOT_FOUND'));
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return next(new api_error_1.ApiError('INVALID_CREDENTIALS'));
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();
        return res.status(200).json({
            user: buildUserResponse(user),
            accessToken,
            refreshToken,
            message: 'Login successful',
        });
    }
    catch (err) {
        console.error('Login error:', err);
        return next(new api_error_1.ApiError('INTERNAL_SERVER_ERROR'));
    }
});
// Refresh token
router.post('/refresh', async (req, res, next) => {
    console.log('Refresh token endpoint called with body:', req.body);
    try {
        const refreshToken = req.cookies?.refresh_token;
        console.log('Refresh token from cookie:', refreshToken);
        if (!refreshToken) {
            return next(new api_error_1.ApiError('REFRESH_TOKEN_REQUIRED'));
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await user_model_1.User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return next(new api_error_1.ApiError('INVALID_REFRESH_TOKEN'));
        }
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        user.refreshToken = newRefreshToken;
        await user.save();
        return res.status(200).json({
            user: buildUserResponse(user),
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            message: 'Token refreshed successfully',
        });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        return next(new api_error_1.ApiError('INVALID_REFRESH_TOKEN'));
    }
});
// Logout
router.post('/logout', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await user_model_1.User.findOneAndUpdate({ refreshToken }, { refreshToken: undefined });
        }
        return res.status(200).json({
            message: 'Logout successful',
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        return next(new api_error_1.ApiError('INTERNAL_SERVER_ERROR'));
    }
});
exports.default = router;
