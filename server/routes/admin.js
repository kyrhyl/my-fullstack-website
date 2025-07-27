const express = require('express');
const auth = require('../middleware/auth');
const { requireAdmin, requirePermission, requireSuperAdmin } = require('../middleware/admin');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate a shorter, more readable filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8); // 6 character random string
    const extension = path.extname(file.originalname);
    const shortName = `img-${timestamp}-${randomId}${extension}`;
    cb(null, shortName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// All admin routes require authentication first, then admin privileges
router.use(auth);
router.use(requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Admin
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const stats = {
      totalUsers,
      totalProducts,
      totalOrders,
      recentOrders
    };

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Admin
router.get('/users', requirePermission('manage_users'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user role/permissions
// @access  Admin
router.put('/users/:id', requirePermission('manage_users'), async (req, res) => {
  try {
    const { role, permissions, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only superadmin can change roles to admin/superadmin
    if (role === 'admin' || role === 'superadmin') {
      if (req.adminUser.role !== 'superadmin') {
        return res.status(403).json({ message: 'Only superadmin can assign admin roles' });
      }
    }

    user.role = role || user.role;
    user.permissions = permissions || user.permissions;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (superadmin only)
// @access  Superadmin
router.delete('/users/:id', requireSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/products
// @desc    Get all products with admin info
// @access  Admin
router.get('/products', requirePermission('manage_products'), async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/admin/products
// @desc    Create new product with image upload
// @access  Admin
router.post('/products', requirePermission('manage_products'), upload.array('images', 5), async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    console.log('Uploaded files:', req.files);
    console.log('All request body keys:', Object.keys(req.body));
    console.log('Individual field values:');
    console.log('- name:', req.body.name);
    console.log('- description:', req.body.description);
    console.log('- price:', req.body.price);
    console.log('- category:', req.body.category);
    console.log('- stock:', req.body.stock);
    
    // Ensure required fields are present
    const { name, description, price, category, stock } = req.body;
    
    if (!name || !description || !price || !category || !stock) {
      console.log('Validation failed:');
      console.log('- name:', !!name);
      console.log('- description:', !!description);
      console.log('- price:', !!price);
      console.log('- category:', !!category);
      console.log('- stock:', !!stock);
      return res.status(400).json({ 
        message: 'Missing required fields: name, description, price, category, stock' 
      });
    }
    
    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else {
      images = ['https://via.placeholder.com/300x200?text=Product+Image'];
    }
    
    const productData = {
      ...req.body,
      price: parseFloat(price),
      stock: parseInt(stock),
      images: images,
      sku: req.body.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    console.log('Final product data being saved:', productData);
    
    const product = new Product(productData);
    await product.save();
    
    console.log('Product created successfully:', product._id);
    res.json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists. Please use a different SKU.' });
    }
    
    if (err.name === 'ValidationError') {
      console.log('Validation error details:', err.errors);
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update product with image upload
// @access  Admin
router.put('/products/:id', requirePermission('manage_products'), upload.array('images', 5), async (req, res) => {
  try {
    console.log('Updating product:', req.params.id, 'with data:', req.body);
    console.log('Uploaded files:', req.files);
    
    // Ensure required fields are present
    const { name, description, price, category, stock } = req.body;
    
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, description, price, category, stock' 
      });
    }
    
    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else {
      // Keep existing images if no new ones uploaded
      const existingProduct = await Product.findById(req.params.id);
      images = existingProduct ? existingProduct.images : ['https://via.placeholder.com/300x200?text=Product+Image'];
    }
    
    const updateData = {
      ...req.body,
      price: parseFloat(price),
      stock: parseInt(stock),
      images: images
    };
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('Product updated successfully:', product._id);
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists. Please use a different SKU.' });
    }
    
    if (err.name === 'ValidationError') {
      console.log('Validation error details:', err.errors);
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Admin
router.delete('/products/:id', requirePermission('manage_products'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Admin
router.get('/orders', requirePermission('manage_orders'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Admin
router.put('/orders/:id/status', requirePermission('manage_orders'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 