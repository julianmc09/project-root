const express = require('express');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Error fetching products.' });
  }
});

// Get product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Error fetching product.' });
  }
});

// Search products (public)
router.get('/search/:term', async (req, res) => {
  try {
    const products = await Product.search(req.params.term);
    res.json(products);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Error searching products.' });
  }
});

// Get products by category (public)
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.findByCategory(req.params.category);
    res.json(products);
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ error: 'Error fetching products by category.' });
  }
});

// Create new product (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;
    
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      image_url: image_url || null
    });
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
    
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Error creating product.' });
  }
});

// Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;
    
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    
    const product = await Product.update(req.params.id, {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      image_url: image_url || null
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    
    res.json({
      message: 'Product updated successfully',
      product
    });
    
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Error updating product.' });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.delete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    
    res.json({
      message: 'Product deleted successfully',
      product
    });
    
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Error deleting product.' });
  }
});

module.exports = router;
