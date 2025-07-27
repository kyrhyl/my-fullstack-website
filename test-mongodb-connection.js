const mongoose = require('mongoose');
require('dotenv').config();

// Test MongoDB Atlas connection
const testConnection = async () => {
  try {
    console.log('🔗 Testing MongoDB Atlas connection...');
    
    // Replace this with your actual connection string
    const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_atlas_connection_string_here';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas connection successful!');
    console.log(`📊 Connected to: ${mongoose.connection.host}`);
    console.log(`🗄️ Database: ${mongoose.connection.name}`);
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Database write test successful!');
    
    // Clean up test data
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Database cleanup successful!');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error(error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your connection string format');
    console.log('2. Verify username and password');
    console.log('3. Ensure IP address is whitelisted');
    console.log('4. Check if cluster is fully provisioned');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
};

testConnection(); 