const productModel = require('../models/product');

module.exports = {
  async index(req, res) {
    try {
      const products = await productModel.findAll();
      res.render('products/index', { 
        products,
        title: 'All Products',
        user: req.user 
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { 
        message: 'Failed to load products' 
      });
    }
  },

  async show(req, res) {
    try {
      const product = await productModel.findById(req.params.id);
      if (!product) {
        return res.status(404).render('error', { 
          message: 'Product not found' 
        });
      }
      res.render('products/show', { 
        product,
        title: product.name,
        user: req.user 
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { 
        message: 'Failed to load product' 
      });
    }
  },

  createForm(req, res) {
    res.render('products/create', { 
      title: 'Create Product',
      user: req.user 
    });
  },

  async create(req, res) {
    try {
      const { name, description, price, image } = req.body;
      await productModel.create({
        name,
        description,
        price,
        image: image || 'https://images.pexels.com/photos/676540/pexels-photo-676540.jpeg',
        user_id: req.user.id
      });
      res.redirect('/products');
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { 
        message: 'Failed to create product' 
      });
    }
  },

  async editForm(req, res) {
    try {
      const product = await productModel.findById(req.params.id);
      if (!product || product.user_id !== req.user.id) {
        return res.status(403).render('error', { 
          message: 'Not authorized to edit this product' 
        });
      }
      res.render('products/edit', { 
        product,
        title: 'Edit Product',
        user: req.user 
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { 
        message: 'Failed to load edit form' 
      });
    }
  },

  async update(req, res) {
    try {
      const product = await productModel.findById(req.params.id);
      if (!product || product.user_id !== req.user.id) {
        return res.status(403).render('error', { 
          message: 'Not authorized to update this product' 
        });
      }

      const { name, description, price, image } = req.body;
      await productModel.update(req.params.id, {
        name,
        description,
        price,
        image: image || product.image
      });

      res.redirect(`/products/${req.params.id}`);
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { 
        message: 'Failed to update product' 
      });
    }
  },

  async delete(req, res) {
    try {
      const product = await productModel.findById(req.params.id);
      if (!product || product.user_id !== req.user.id) {
        return res.status(403).render('error', { 
          message: 'Not authorized to delete this product' 
        });
      }

      await productModel.delete(req.params.id);
      res.redirect('/products');
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { 
        message: 'Failed to delete product' 
      });
    }
  }
};