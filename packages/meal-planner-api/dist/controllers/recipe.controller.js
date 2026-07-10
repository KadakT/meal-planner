"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipe = exports.updateRecipe = exports.getRecipeById = exports.getRecipes = exports.createRecipe = void 0;
const recipe_model_1 = require("../models/recipe.model");
const api_error_1 = require("../utils/api-error");
const createRecipe = async (req, res) => {
    try {
        const recipe = new recipe_model_1.Recipe({
            ...req.body,
            userId: req.userId
        });
        const saved = await recipe.save();
        res.status(201).json(saved);
    }
    catch (error) {
        console.error('CREATE RECIPE ERROR:', error);
        res.status(500).json({ message: 'Failed to create recipe' });
    }
};
exports.createRecipe = createRecipe;
const getRecipes = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 10, 1);
        const skip = (page - 1) * limit;
        const filter = {
            userId: req.userId,
        };
        const [recipes, total] = await Promise.all([
            recipe_model_1.Recipe.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            recipe_model_1.Recipe.countDocuments(filter),
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
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch recipes' });
    }
};
exports.getRecipes = getRecipes;
const getRecipeById = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await recipe_model_1.Recipe.findOne({
            _id: recipeId,
            userId: req.userId
        });
        if (!recipe) {
            return res.status(404).json({
                message: 'Recipe not found or not owned by user'
            });
        }
        res.json(recipe);
    }
    catch (error) {
        console.error('GET RECIPE BY ID ERROR:', error);
        res.status(500).json({ message: 'Failed to fetch recipe' });
    }
};
exports.getRecipeById = getRecipeById;
const updateRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await recipe_model_1.Recipe.findOneAndUpdate({ _id: recipeId, userId: req.userId }, req.body, { new: true });
        if (!recipe) {
            return (new api_error_1.ApiError('RECIPE_NOT_FOUND'));
        }
        res.json(recipe);
    }
    catch (error) {
        console.error('UPDATE RECIPE ERROR:', error);
        res.status(500).json({ message: 'Failed to update recipe' });
    }
};
exports.updateRecipe = updateRecipe;
const deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await recipe_model_1.Recipe.findOneAndDelete({
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
    }
    catch (error) {
        console.error('DELETE RECIPE ERROR:', error);
        res.status(500).json({ message: 'Failed to delete recipe' });
    }
};
exports.deleteRecipe = deleteRecipe;
