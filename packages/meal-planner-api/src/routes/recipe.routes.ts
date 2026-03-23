import { Router } from 'express';
import {
  createRecipe,
  getRecipes,
  updateRecipe,
  deleteRecipe
} from '../controllers/recipe.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createRecipe);
router.get('/', authMiddleware, getRecipes);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

export default router;