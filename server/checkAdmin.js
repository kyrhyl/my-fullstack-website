const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@estore.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      console.log('Please register with admin@estore.com to create admin user');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('Name:', adminUser.name);
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('Permissions:', adminUser.permissions);
    console.log('Is Admin:', adminUser.isAdmin());
    console.log('Has manage_products permission:', adminUser.hasPermission('manage_products'));
    
    // Test creating a simple product
    const Product = require('./models/Product');
    const testProduct = new Product({
      name: 'Test Product',
      description: 'Test Description',
      price: 29.99,
      category: 'electronics',
      stock: 10,
      brand: 'Test Brand',
      images: ['https://via.placeholder.com/300x200?text=Test+Product'],
      sku: `TEST-${Date.now()}`
    });
    
    await testProduct.save();
    console.log('✅ Test product created successfully:', testProduct._id);
    
    // Clean up test product
    await Product.findByIdAndDelete(testProduct._id);
    console.log('✅ Test product cleaned up');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkAdmin(); 