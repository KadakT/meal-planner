import { Router } from 'express';
import {
  createRecipe,
  getRecipes,
  updateRecipe,
  deleteRecipe,
  getRecipeById
} from '../controllers/recipe.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createRecipe);
router.get('/', authMiddleware, getRecipes);
router.get('/:id', authMiddleware, getRecipeById);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

export default router;