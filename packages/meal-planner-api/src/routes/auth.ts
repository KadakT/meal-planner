import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { ApiError } from '../utils/api-error';
import { LoginPayload, RegisterPayload } from '@meal-planner/shared';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body);
    const { email, name, password }: RegisterPayload = req.body;

    // 🔹 1. Validate input
    if (!email || !password || !name) {
      return next(new ApiError('EMAIL_NAME_AND_PASSWORD_REQUIRED'));
    }

    // 🔹 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError('USER_EXISTS'));
    }

    // 🔹 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 4. Create and save new user
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    // 🔹 5. Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

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

  } catch (error) {
    console.error('Register error:', error);
    return next(new ApiError('INTERNAL_SERVER_ERROR'));
  }
});

// Login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // 🔹 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError('USER_NOT_FOUND'));
    }

    // 🔹 2. Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ApiError('INVALID_CREDENTIALS'));
    }

    // 🔹 3. Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

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

  } catch (err) {
    console.error('Login error:', err);
    return next(new ApiError('INTERNAL_SERVER_ERROR'));
  }
});

export default router;
