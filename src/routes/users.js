const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Registration
router.get('/register', (req, res) => res.render('users/register', { 
  title: 'Register',
  user: req.user 
}));
router.post('/register', userController.register);

// Login
router.get('/login', (req, res) => res.render('users/login', { 
  title: 'Login',
  user: req.user 
}));
router.post('/login', userController.login);

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.redirect('/');
});

// Protected routes
router.use(authMiddleware);

// Profile
router.get('/profile', userController.profile);
router.put('/profile', userController.updateProfile);

module.exports = router;