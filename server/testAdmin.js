const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

async function testAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@estore.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      console.log('Please register with admin@estore.com first');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('- Name:', adminUser.name);
    console.log('- Role:', adminUser.role);
    console.log('- Permissions:', adminUser.permissions);
    console.log('- Is Admin:', adminUser.isAdmin());
    
    // Test product creation
    const testProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: 29.99,
      category: 'electronics',
      stock: 10,
      brand: 'Test Brand',
      images: ['https://via.placeholder.com/300x200?text=Test+Product'],
      sku: `TEST-${Date.now()}`
    };
    
    const product = new Product(testProduct);
    await product.save();
    console.log('✅ Test product created:', product._id);
    
    // Clean up
    await Product.findByIdAndDelete(product._id);
    console.log('✅ Test product cleaned up');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testAdmin(); 