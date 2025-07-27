const mongoose = require('mongoose');

// Simple test with different connection options
const testConnection = async () => {
  try {
    console.log('🔗 Testing MongoDB Atlas connection...');
    
    // Try without database name first
    const MONGODB_URI = 'mongodb+srv://michaelangelochatto:Thessalonica123@my-ecommerce-db.6gfovmu.mongodb.net/?retryWrites=true&w=majority&appName=my-ecommerce-db';
    
    console.log('📡 Attempting to connect...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    
    console.log('✅ Connection successful!');
    console.log(`📊 Host: ${mongoose.connection.host}`);
    console.log(`🗄️ Database: ${mongoose.connection.name}`);
    
    // List available databases
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log('📋 Available databases:');
    dbs.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n🔐 Authentication Error - Check these:');
      console.log('1. Username: michaelangelochatto');
      console.log('2. Password: Thessalonica123');
      console.log('3. User permissions in MongoDB Atlas');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🌐 Network Error - Check these:');
      console.log('1. Internet connection');
      console.log('2. Cluster name: my-ecommerce-db');
      console.log('3. Cluster status in MongoDB Atlas');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
};

testConnection(); 