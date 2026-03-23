import { Request, Response } from 'express';
import { Recipe } from '../models/recipe.model';
import { ApiError } from '../utils/api-error';

interface AuthRequest extends Request {
  userId?: string;
}

export const createRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      userId: req.userId
    });

    const saved = await recipe.save();
    res.status(201).json(saved);

  } catch (error) {
    console.error('CREATE RECIPE ERROR:', error);
    res.status(500).json({ message: 'Failed to create recipe' });
  }
};

export const getRecipes = async (req: AuthRequest, res: Response) => {
  try {
    const recipes = await Recipe.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(recipes);

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};

export const updateRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findOneAndUpdate(
      { _id: recipeId, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!recipe) {
     return (new ApiError('RECIPE_NOT_FOUND'));
    }

    res.json(recipe);

  } catch (error) {
    console.error('UPDATE RECIPE ERROR:', error);
    res.status(500).json({ message: 'Failed to update recipe' });
  }
};

export const deleteRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findOneAndDelete({
      _id: recipeId,
      userId: req.userId
    });

    if (!recipe) {
      return res.status(404).json({
        message: 'Recipe not found or not owned by user'
      });
    }

    res.json({
      message: 'Recipe deleted successfully'
    });

  } catch (error) {
    console.error('DELETE RECIPE ERROR:', error);
    res.status(500).json({ message: 'Failed to delete recipe' });
  }
};