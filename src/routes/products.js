const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.index);
router.get('/:id', productController.show);

// Protected routes
router.use(authMiddleware);
router.get('/create', productController.createForm);
router.post('/', productController.create);
router.get('/:id/edit', productController.editForm);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router;