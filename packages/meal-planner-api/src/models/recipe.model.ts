import mongoose, { Schema, Document } from 'mongoose';

interface Ingredient {
  name: string;
  amount?: string;
  unit?: string;
}

export interface RecipeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  ingredients: Ingredient[];
  instruction: string;
  category?: string;
  imageUrl?: string;
  createdAt: Date;
  notes?: string;
}

const IngredientSchema = new Schema<Ingredient>({
  name: { type: String, required: true },
  amount: { type: String },
  unit: { type: String }
});

const RecipeSchema = new Schema<RecipeDocument>({
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  ingredients: [IngredientSchema],
  instruction: { type: String, required: true },
  category: String,
  imageUrl: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Recipe = mongoose.model<RecipeDocument>('Recipe', RecipeSchema);