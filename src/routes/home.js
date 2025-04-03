const express = require('express');
const router = express.Router();
const productModel = require('../models/product');

router.get('/', async (req, res) => {
  try {
    const products = await productModel.findAll();
    res.render('home', { 
      products,
      title: 'Home',
      user: req.user 
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      message: 'Server Error' 
    });
  }
});

module.exports = router;