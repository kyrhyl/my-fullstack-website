const mongoose = require('mongoose');

// Test with new database user
const testConnection = async () => {
  try {
    console.log('🔗 Testing with new database user...');
    
    // Try with new user credentials
    const MONGODB_URI = 'mongodb+srv://ecommerce_user:ecommerce123@my-ecommerce-db.6gfovmu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=my-ecommerce-db';
    
    console.log('📡 Attempting to connect...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Connection successful!');
    console.log(`📊 Host: ${mongoose.connection.host}`);
    console.log(`🗄️ Database: ${mongoose.connection.name}`);
    
    console.log('\n🎉 MongoDB Atlas is ready for your e-commerce website!');
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error.message);
    
    console.log('\n📋 Next steps:');
    console.log('1. Go to MongoDB Atlas Dashboard');
    console.log('2. Create new database user: ecommerce_user');
    console.log('3. Set password: ecommerce123');
    console.log('4. Grant "Read and write to any database" permissions');
    console.log('5. Add IP access: 0.0.0.0/0');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
};

testConnection(); 