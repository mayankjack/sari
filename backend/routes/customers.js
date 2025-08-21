const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/customers
// @desc    Get all customers (admin only)
// @access  Admin only
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = { role: 'customer' };

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const customers = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      customers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/customers/:id
// @desc    Get customer details (admin only)
// @access  Admin only
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
      .select('-password');

    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get customer's order history
    const orders = await Order.find({ customer: customer._id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate customer statistics
    const totalOrders = await Order.countDocuments({ customer: customer._id });
    const totalSpent = await Order.aggregate([
      { $match: { customer: customer._id, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const customerData = {
      ...customer.toObject(),
      orders,
      totalOrders,
      totalSpent: totalSpent[0]?.total || 0
    };

    res.json(customerData);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update customer (admin only)
// @access  Admin only
router.put('/:id', adminAuth, [
  body('firstName').optional().isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters'),
  body('lastName').optional().isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().isLength({ max: 20 }).withMessage('Phone number too long'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer = await User.findById(req.params.id);

    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update only provided fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        customer[key] = req.body[key];
      }
    });

    await customer.save();

    res.json({
      message: 'Customer updated successfully',
      customer: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        username: customer.username,
        phone: customer.phone,
        address: customer.address,
        isActive: customer.isActive,
        createdAt: customer.createdAt
      }
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/customers/:id/status
// @desc    Toggle customer active status (admin only)
// @access  Admin only
router.put('/:id/status', adminAuth, [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isActive } = req.body;

    const customer = await User.findById(req.params.id);

    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.isActive = isActive;
    await customer.save();

    res.json({
      message: `Customer ${isActive ? 'activated' : 'deactivated'} successfully`,
      customer: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        isActive: customer.isActive
      }
    });
  } catch (error) {
    console.error('Toggle customer status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/customers/:id/orders
// @desc    Get customer's order history (admin only)
// @access  Admin only
router.get('/:id/orders', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const query = { customer: customer._id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/customers/stats/overview
// @desc    Get customer statistics overview (admin only)
// @access  Admin only
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeCustomers = await User.countDocuments({ role: 'customer', isActive: true });
    const newCustomersThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Top customers by order value
    const topCustomers = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: '$customer',
          totalSpent: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customerInfo'
        }
      },
      {
        $project: {
          customer: { $arrayElemAt: ['$customerInfo', 0] },
          totalSpent: 1,
          orderCount: 1
        }
      }
    ]);

    res.json({
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      topCustomers
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
