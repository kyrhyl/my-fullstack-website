const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');
require('dotenv').config();

async function cleanupImages() {
  try {
    // Connect to MongoDB
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Get all products and their image paths
    const products = await Product.find({}, 'images');
    const usedImages = new Set();
    
    products.forEach(product => {
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach(imagePath => {
          // Extract filename from path
          const filename = imagePath.split('/').pop();
          if (filename) {
            usedImages.add(filename);
          }
        });
      }
    });
    
    console.log(`Found ${usedImages.size} images currently in use`);
    
    // Get all files in uploads directory
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);
    
    console.log(`Found ${files.length} files in uploads directory`);
    
    // Find unused files
    const unusedFiles = files.filter(file => !usedImages.has(file));
    
    console.log(`Found ${unusedFiles.length} unused files`);
    
    if (unusedFiles.length > 0) {
      console.log('Unused files:');
      unusedFiles.forEach(file => {
        console.log(`  - ${file}`);
      });
      
      // Ask user if they want to delete unused files
      console.log('\nTo delete unused files, run: node cleanupImages.js --delete');
    }
    
    // If --delete flag is provided, delete unused files
    if (process.argv.includes('--delete')) {
      console.log('\n🗑️  Deleting unused files...');
      unusedFiles.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        console.log(`  Deleted: ${file}`);
      });
      console.log('✅ Cleanup completed!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

cleanupImages(); 