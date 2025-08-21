const express = require('express');
const { body, validationResult } = require('express-validator');
const Shop = require('../models/Shop');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/shop
// @desc    Get shop settings (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let shop = await Shop.findOne();
    
    if (!shop) {
      // Create default shop settings if none exist
      shop = new Shop();
      await shop.save();
    }

    res.json(shop);
  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shop
// @desc    Update shop settings
// @access  Admin only
router.put('/', adminAuth, [
  body('name').optional().isLength({ min: 1, max: 100 }).withMessage('Shop name must be between 1 and 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('contact.email').optional().isEmail().withMessage('Invalid email format'),
  body('settings.currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('settings.taxRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax rate must be between 0 and 100'),
  body('settings.shippingCost').optional().isFloat({ min: 0 }).withMessage('Shipping cost must be non-negative'),
  body('settings.freeShippingThreshold').optional().isFloat({ min: 0 }).withMessage('Free shipping threshold must be non-negative')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let shop = await Shop.findOne();
    
    if (!shop) {
      shop = new Shop();
    }

    // Update only provided fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        if (typeof req.body[key] === 'object' && req.body[key] !== null) {
          shop[key] = { ...shop[key], ...req.body[key] };
        } else {
          shop[key] = req.body[key];
        }
      }
    });

    await shop.save();

    res.json({
      message: 'Shop settings updated successfully',
      shop
    });
  } catch (error) {
    console.error('Update shop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shop/logo
// @desc    Update shop logo
// @access  Admin only
router.put('/logo', adminAuth, [
  body('logo').notEmpty().withMessage('Logo URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { logo } = req.body;

    let shop = await Shop.findOne();
    if (!shop) {
      shop = new Shop();
    }

    shop.logo = logo;
    await shop.save();

    res.json({
      message: 'Logo updated successfully',
      shop
    });
  } catch (error) {
    console.error('Update logo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shop/favicon
// @desc    Update shop favicon
// @access  Admin only
router.put('/favicon', adminAuth, [
  body('favicon').notEmpty().withMessage('Favicon URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { favicon } = req.body;

    let shop = await Shop.findOne();
    if (!shop) {
      shop = new Shop();
    }

    shop.favicon = favicon;
    await shop.save();

    res.json({
      message: 'Favicon updated successfully',
      shop
    });
  } catch (error) {
    console.error('Update favicon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shop/theme
// @desc    Update shop theme colors
// @access  Admin only
router.put('/theme', adminAuth, [
  body('primaryColor').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Primary color must be a valid hex color'),
  body('secondaryColor').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Secondary color must be a valid hex color'),
  body('accentColor').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Accent color must be a valid hex color')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let shop = await Shop.findOne();
    if (!shop) {
      shop = new Shop();
    }

    // Update theme colors
    if (req.body.primaryColor) shop.theme.primaryColor = req.body.primaryColor;
    if (req.body.secondaryColor) shop.theme.secondaryColor = req.body.secondaryColor;
    if (req.body.accentColor) shop.theme.accentColor = req.body.accentColor;

    await shop.save();

    res.json({
      message: 'Theme updated successfully',
      shop
    });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shop/maintenance
// @desc    Toggle maintenance mode
// @access  Admin only
router.put('/maintenance', adminAuth, [
  body('maintenanceMode').isBoolean().withMessage('Maintenance mode must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { maintenanceMode } = req.body;

    let shop = await Shop.findOne();
    if (!shop) {
      shop = new Shop();
    }

    shop.settings.maintenanceMode = maintenanceMode;
    await shop.save();

    res.json({
      message: `Maintenance mode ${maintenanceMode ? 'enabled' : 'disabled'} successfully`,
      shop
    });
  } catch (error) {
    console.error('Toggle maintenance mode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/shop/stats
// @desc    Get shop statistics (admin only)
// @access  Admin only
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const Product = require('../models/Product');
    const Order = require('../models/Order');
    const User = require('../models/User');

    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('customer', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    const lowStockProducts = await Product.find({
      isActive: true,
      stock: { $lt: 10 }
    }).select('name stock price');

    res.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    console.error('Get shop stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
