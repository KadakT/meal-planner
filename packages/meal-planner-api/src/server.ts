
// // ✅ Start server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import recipeRoutes from './routes/recipe.routes';
import { globalErrorHandler } from './middleware/error-handler';


// Env variables
const MONGO_URI = process.env.MONGO_URI as string;
const PORT = process.env.PORT || 5000;

// Express app setup
const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'Connected to backend!' });
});

app.use(globalErrorHandler);

// Start server AFTER Mongo connects
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'mealplanner' // make sure this matches your DB
    });

    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

startServer();
