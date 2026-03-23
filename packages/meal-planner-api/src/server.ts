// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import { MongoClient, ServerApiVersion } from 'mongodb';
// import path from 'path';

// // Load environment variables from backend/.env
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// // Safely assert env variables
// const MONGO_URI = process.env.MONGO_URI as string;
// const JWT_SECRET = process.env.JWT_SECRET as string;
// const PORT = process.env.PORT || 5000;

// // ✅ Express app setup
// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ Mongoose connection
// mongoose.connect(MONGO_URI, {} as mongoose.ConnectOptions)
//   .then(() => console.log('MongoDB (Mongoose) connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // ✅ Optional: Raw MongoDB client ping (optional)
// const client = new MongoClient(MONGO_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function runMongoClientPing() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your MongoDB deployment!");
//   } catch (err) {
//     console.error("MongoDB ping failed:", err);
//   } finally {
//     await client.close();
//   }
// }
// runMongoClientPing();

// // ✅ Routes
// import authRoutes from './routes/auth';
// import { globalErrorHandler } from './middleware/error-handler';
// import recipeRoutes from './routes/recipe.routes';
// app.use('/api/auth', authRoutes);

// app.use('/api/recipes', recipeRoutes);

// app.get('/api/test', (req: Request, res: Response) => {
//   res.json({ message: 'Connected to backend!' });
// });

// app.use(globalErrorHandler);

// // ✅ Start server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import recipeRoutes from './routes/recipe.routes';
import { globalErrorHandler } from './middleware/error-handler';


// Env variables
const MONGO_URI = process.env.MONGO_URI as string;
const PORT = process.env.PORT || 5000;

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

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
