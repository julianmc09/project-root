const express = require('express');
const Purchase = require('../models/Purchase');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create new purchase (authenticated users)
router.post('/', auth, async (req, res) => {
  try {
    const { total_amount, items } = req.body;
    
    if (!total_amount || !items || items.length === 0) {
      return res.status(400).json({ error: 'Total amount and items are required.' });
    }
    
    const purchase = await Purchase.create({
      user_id: req.user.id,
      total_amount: parseFloat(total_amount),
      items
    });
    
    res.status(201).json({
      message: 'Purchase completed successfully',
      purchase
    });
    
  } catch (error) {
    console.error('Create purchase error:', error);
    res.status(500).json({ error: 'Error creating purchase.' });
  }
});

// Get purchase by ID (authenticated users)
router.get('/:id', auth, async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found.' });
    }
    
    // Check if user owns this purchase or is admin
    if (purchase.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    
    const purchaseItems = await Purchase.getPurchaseItems(req.params.id);
    
    res.json({
      purchase,
      items: purchaseItems
    });
    
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({ error: 'Error fetching purchase.' });
  }
});

// Get user purchases (authenticated users)
router.get('/user/me', auth, async (req, res) => {
  try {
    const purchases = await Purchase.findByUserId(req.user.id);
    res.json(purchases);
  } catch (error) {
    console.error('Get user purchases error:', error);
    res.status(500).json({ error: 'Error fetching user purchases.' });
  }
});

// Get all purchases (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    res.json(purchases);
  } catch (error) {
    console.error('Get all purchases error:', error);
    res.status(500).json({ error: 'Error fetching purchases.' });
  }
});

// Update purchase status (admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }
    
    const purchase = await Purchase.updateStatus(req.params.id, status);
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found.' });
    }
    
    res.json({
      message: 'Purchase status updated successfully',
      purchase
    });
    
  } catch (error) {
    console.error('Update purchase status error:', error);
    res.status(500).json({ error: 'Error updating purchase status.' });
  }
});

// Delete purchase (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const purchase = await Purchase.delete(req.params.id);
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found.' });
    }
    
    res.json({
      message: 'Purchase deleted successfully',
      purchase
    });
    
  } catch (error) {
    console.error('Delete purchase error:', error);
    res.status(500).json({ error: 'Error deleting purchase.' });
  }
});

module.exports = router;
