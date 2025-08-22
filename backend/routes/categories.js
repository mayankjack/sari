const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, parent, active } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (parent === 'null' || parent === '') {
      query.parentCategory = null;
    } else if (parent) {
      query.parentCategory = parent;
    }
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { sortOrder: 1, name: 1 }
    };
    
    const categories = await Category.find(query)
      .populate('parentCategory', 'name')
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);
    
    const total = await Category.countDocuments(query);
    
    res.json({
      categories,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      total
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single category (public)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get category tree (public)
router.get('/tree/all', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parentCategory', 'name')
      .sort({ sortOrder: 1, name: 1 });
    
    // Build tree structure
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => String(item.parentCategory?._id || item.parentCategory) === String(parentId))
        .map(item => ({
          ...item.toObject(),
          children: buildTree(items, item._id)
        }));
    };
    
    const tree = buildTree(categories);
    res.json(tree);
  } catch (error) {
    console.error('Error fetching category tree:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create category (admin only)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('parentCategory')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true; // Allow empty/null for main categories
      }
      if (typeof value === 'string' && value.match(/^[0-9a-fA-F]{24}$/)) {
        return true; // Valid MongoDB ObjectId
      }
      throw new Error('Invalid parent category ID');
    }),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('Sort order must be a positive integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, parentCategory, sortOrder, isActive, metaTitle, metaDescription } = req.body;
    
    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    // Check if parent category exists
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({ message: 'Parent category not found' });
      }
    }
    
    const category = new Category({
      name,
      description,
      parentCategory: parentCategory || null,
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
      metaTitle,
      metaDescription,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    });
    
    await category.save();
    
    const populatedCategory = await Category.findById(category._id)
      .populate('parentCategory', 'name');
    
    res.status(201).json(populatedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update category (admin only)
router.put('/:id', adminAuth, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('parentCategory')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true; // Allow empty/null for main categories
      }
      if (typeof value === 'string' && value.match(/^[0-9a-fA-F]{24}$/)) {
        return true; // Valid MongoDB ObjectId
      }
      throw new Error('Invalid parent category ID');
    }),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('Sort order must be a positive integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, parentCategory, sortOrder, isActive, metaTitle, metaDescription } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category with same name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name, _id: { $ne: req.params.id } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }
    
    // Check if parent category exists and prevent circular reference
    if (parentCategory) {
      if (parentCategory === req.params.id) {
        return res.status(400).json({ message: 'Category cannot be its own parent' });
      }
      
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({ message: 'Parent category not found' });
      }
      
      // Check for circular reference
      let currentParent = parent.parentCategory;
      while (currentParent) {
        if (String(currentParent) === req.params.id) {
          return res.status(400).json({ message: 'Circular reference detected' });
        }
        const parentDoc = await Category.findById(currentParent);
        currentParent = parentDoc?.parentCategory;
      }
    }
    
    // Update fields
    if (name !== undefined) {
      category.name = name;
      // Update slug when name changes
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) category.description = description;
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (isActive !== undefined) category.isActive = isActive;
    if (metaTitle !== undefined) category.metaTitle = metaTitle;
    if (metaDescription !== undefined) category.metaDescription = metaDescription;
    
    await category.save();
    
    const updatedCategory = await Category.findById(category._id)
      .populate('parentCategory', 'name');
    
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete category (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category has children
    const hasChildren = await Category.exists({ parentCategory: req.params.id });
    if (hasChildren) {
      return res.status(400).json({ message: 'Cannot delete category with subcategories' });
    }
    
    // Check if category is used in products
    const Product = require('../models/Product');
    const productsUsingCategory = await Product.exists({ category: category.name });
    if (productsUsingCategory) {
      return res.status(400).json({ message: 'Cannot delete category that is used by products' });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Toggle category status (admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    category.isActive = !category.isActive;
    await category.save();
    
    res.json({ message: 'Category status updated', isActive: category.isActive });
  } catch (error) {
    console.error('Error toggling category status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
