const User = require('../models/User');

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    console.log('Admin middleware - req.user:', req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('Admin middleware - user role:', user.role);
    console.log('Admin middleware - user permissions:', user.permissions);

    if (!user.isAdmin()) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.adminUser = user;
    next();
  } catch (err) {
    console.error('Admin middleware error:', err.message);
    res.status(500).send('Server error');
  }
};

// Middleware to check specific permissions
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      console.log('Permission middleware - checking permission:', permission);
      
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      console.log('Permission middleware - user permissions:', user.permissions);
      console.log('Permission middleware - user isAdmin:', user.isAdmin());

      if (!user.hasPermission(permission)) {
        return res.status(403).json({ 
          message: `Access denied. ${permission} permission required.` 
        });
      }

      req.adminUser = user;
      next();
    } catch (err) {
      console.error('Permission middleware error:', err.message);
      res.status(500).send('Server error');
    }
  };
};

// Middleware to check if user is superadmin
const requireSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
    }

    req.adminUser = user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  requireAdmin,
  requirePermission,
  requireSuperAdmin
}; 