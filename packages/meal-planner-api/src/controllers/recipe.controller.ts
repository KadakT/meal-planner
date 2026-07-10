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
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = {
      userId: req.userId,
    };

    const [recipes, total] = await Promise.all([
      Recipe.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Recipe.countDocuments(filter),
    ]);

    res.json({
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};

export const getRecipeById = async (req: AuthRequest, res: Response) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findOne({
      _id: recipeId,
      userId: req.userId
    });

    if (!recipe) {
      return res.status(404).json({
        message: 'Recipe not found or not owned by user'
      });
    }

    res.json(recipe);

  } catch (error) {
    console.error('GET RECIPE BY ID ERROR:', error);
    res.status(500).json({ message: 'Failed to fetch recipe' });
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