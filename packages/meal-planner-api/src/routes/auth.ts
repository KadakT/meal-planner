import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { ApiError } from '../utils/api-error';
import { LoginPayload } from '@meal-planner/shared';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Register
router.post('/register', async (req: Request, res: any, next: NextFunction) => {
  try {
    const { username, password }: LoginPayload = req.body;
    console.log('username = '+username);
        console.log('password = '+password);

    if (!username || !password) {
      return next(new ApiError('USENAME_AND_PASSWORD_REQUIRED'));
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) next(new ApiError('USER_EXISTS'));

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({ token, message: 'User registered successfully' });

  } catch (error) {
    console.error('Register error:', error);
    return next(new ApiError('INTERNAL_SERVER_ERROR'));
  }
});

// Login
router.post('/login', async (req: Request, res: any, next: NextFunction) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return next(new ApiError('USER_NOT_FOUND'));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ApiError('INVALID_CREDENTIALS'));

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    return next(new ApiError('INTERNAL_SERVER_ERROR'));
    // res.status(500).json({ message: 'Server error' });
  }
});

export default router;
