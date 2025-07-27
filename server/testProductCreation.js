const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function testProductCreation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Test product data
    const testProductData = {
      name: 'Test Product',
      description: 'This is a test product description',
      price: 29.99,
      category: 'electronics',
      stock: 10,
      brand: 'Test Brand',
      images: ['https://via.placeholder.com/300x200?text=Test+Product'],
      sku: `TEST-${Date.now()}`
    };
    
    console.log('Test product data:', testProductData);
    
    // Create product
    const product = new Product(testProductData);
    await product.save();
    
    console.log('✅ Test product created successfully:', product._id);
    console.log('✅ Product details:', {
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images
    });
    
    // Clean up
    await Product.findByIdAndDelete(product._id);
    console.log('✅ Test product cleaned up');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testProductCreation(); 