const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function testImageUpload() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Check if uploads directory exists
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory');
    } else {
      console.log('✅ Uploads directory exists');
    }
    
    // Test creating a product with image paths
    const testProduct = {
      name: 'Test Product with Images',
      description: 'This is a test product to verify image upload functionality',
      price: 29.99,
      category: 'electronics',
      stock: 10,
      brand: 'Test Brand',
      images: [
        '/uploads/test-image-1.jpg',
        '/uploads/test-image-2.png'
      ],
      sku: `TEST-IMG-${Date.now()}`
    };
    
    const product = new Product(testProduct);
    await product.save();
    console.log('✅ Test product created with image paths:', product._id);
    console.log('✅ Product images:', product.images);
    
    // Clean up test product
    await Product.findByIdAndDelete(product._id);
    console.log('✅ Test product cleaned up');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testImageUpload(); 