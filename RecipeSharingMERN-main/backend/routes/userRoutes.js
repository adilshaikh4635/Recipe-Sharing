const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getAllUsers, 
  deleteUser // Import the deleteUser function
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import middleware if needed
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile/:userID', protect, getUserProfile);
router.get('/', getAllUsers); // Only admin can access all users
router.delete('/:id', deleteUser); // Only admin can delete users

module.exports = router;