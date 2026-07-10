import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { ApiError } from '../utils/api-error';
import { RegisterPayload } from '@meal-planner/shared';

const router = Router();

const generateAccessToken = (user: any) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user: any, rememberMe: boolean) => {
  return jwt.sign(
    {
      userId: user._id,
      rememberMe,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: rememberMe ? '7d' : '1h',
    }
  );
};

const buildUserResponse = (user: any) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
});

const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string,
  rememberMe: boolean
): void => {
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : undefined, // session cookie
  });
};

// Register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password, rememberMe }: RegisterPayload = req.body;

    if (!email || !password || !name) {
      return next(new ApiError('EMAIL_NAME_AND_PASSWORD_REQUIRED'));
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ApiError('USER_EXISTS'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser, rememberMe);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    setRefreshTokenCookie(res, refreshToken, rememberMe);

    return res.status(201).json({
      user: buildUserResponse(newUser),
      accessToken,
      message: 'User registered successfully',
    });

  } catch (err) {
    return next(err);
  }
});

// Login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, rememberMe } = req.body;
    console.log('Login request:', { email, rememberMe });

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ApiError('USER_NOT_FOUND'));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ApiError('INVALID_CREDENTIALS'));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, rememberMe);

    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken, rememberMe);

    return res.status(200).json({
      user: buildUserResponse(user),
      accessToken,
      message: 'Login successful',
    });

  } catch (err) {
    console.error('Login error:', err);
    return next(new ApiError('INTERNAL_SERVER_ERROR'));
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return next(new ApiError('REFRESH_TOKEN_REQUIRED'));
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { userId: string; rememberMe: boolean; };

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return next(new ApiError('INVALID_REFRESH_TOKEN'));
    }

    const rememberMe = decoded.rememberMe;

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user, rememberMe);

    user.refreshToken = newRefreshToken;
    await user.save();

    setRefreshTokenCookie(res, newRefreshToken, rememberMe);

    return res.status(200).json({
      user: buildUserResponse(user),
      accessToken: newAccessToken,
      message: 'Token refreshed successfully',
    });

  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new ApiError('REFRESH_TOKEN_EXPIRED'));
    }
    console.error('Refresh token error:', error);
    return next(new ApiError('INVALID_REFRESH_TOKEN'));
  }
});

// Logout
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: undefined }
      );
    }

    return res.status(200).json({
      message: 'Logout successful',
    });

  } catch (error) {
    console.error('Logout error:', error);
    return next(new ApiError('INTERNAL_SERVER_ERROR'));
  }
});

export default router;