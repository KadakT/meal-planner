import { Schema, model, Document, Types } from 'mongoose';

// 1️⃣ Define TypeScript interface for type safety
export interface IUser extends Document {
  _id: Types.ObjectId;
  refreshToken?: string;
  name: string;        // user's display name
  email: string;       // unique email address
  password: string;    // hashed password
  createdAt: Date;     // timestamp
  updatedAt: Date;     // timestamp
}

// 2️⃣ Create the schema
const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// 3️⃣ Export the model
export const User = model<IUser>('User', UserSchema);
