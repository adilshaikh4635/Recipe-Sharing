const express = require('express');
const {
    createRecipe, getRecipes, getRecipeById, // ✅ Added getRecipeById
    savedRecipe, getsavedRecipe, getsavedRecipebyid, 
    rateRecipe, gettotalReciperatting,
    getComments, addComment, editComment, deleteComment, 
    getMyrecipe, editMyrecipe, deleteMyrecipe, 
    getFeaturerecipe, getAllRecipesAdmin, deleteRecipeAdmin, editAdminRecipe
} = require('../controllers/recipeController');

const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// ✅ Fetch all recipes & Create a new recipe
router.route('/').get(getRecipes).post(protect, createRecipe);

// ✅ Fetch a single recipe by ID (NEW)
router.route('/:recipeId').get(getRecipeById);

// ✅ Save a recipe
router.route('/').put(protect, savedRecipe);

// ✅ Get saved recipes
router.route('/savedrecipes/:userID').get(protect, getsavedRecipe);
router.route('/savedrecipes/ids/:userID').get(protect, getsavedRecipebyid);

// ✅ Recipe Rating routes
router.route('/:recipeId/rate').post(protect, rateRecipe).get(gettotalReciperatting);

// ✅ Comment routes
router.route('/:recipeId/comments').get(getComments).post(protect, addComment);
router.route('/:recipeId/comments/:commentId').put(protect, editComment).delete(protect, deleteComment);

// ✅ My Recipe routes
router.route('/myrecipe/:userId').get(protect, getMyrecipe).put(protect, editMyrecipe);
router.route('/myrecipe/:recipeId').delete(protect, deleteMyrecipe);

// ✅ Get featured recipe
router.route('/feat/featured').get(getFeaturerecipe);

// ✅ For admin
router.route('/').get(getAllRecipesAdmin);
router.route('/:recipeId').delete(deleteRecipeAdmin);
// router.route('/:recipeId').put(editAdminRecipe);
router.put('/admin/:id', editAdminRecipe);
module.exports = router;
