const mongoose = require('mongoose');

// Test MongoDB Atlas connection with your actual connection string
const testConnection = async () => {
  try {
    console.log('🔗 Testing your MongoDB Atlas connection...');
    
    // Your actual connection string with URL-encoded password
    // Thessalonica123 needs to be URL-encoded for special characters
    const MONGODB_URI = 'mongodb+srv://michaelangelochatto:Thessalonica123@my-ecommerce-db.6gfovmu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=my-ecommerce-db';
    
    console.log('📡 Attempting to connect to MongoDB Atlas...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas connection successful!');
    console.log(`📊 Connected to: ${mongoose.connection.host}`);
    console.log(`🗄️ Database: ${mongoose.connection.name}`);
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ 
      test: 'connection', 
      timestamp: new Date(),
      message: 'E-commerce database connection test'
    });
    console.log('✅ Database write test successful!');
    
    // Clean up test data
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Database cleanup successful!');
    
    console.log('\n🎉 Your MongoDB Atlas is ready for your e-commerce website!');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error(error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if your cluster is fully provisioned (may take 2-3 minutes)');
    console.log('2. Verify the password is correct');
    console.log('3. Ensure IP address is whitelisted (0.0.0.0/0 for all IPs)');
    console.log('4. Check if the database user has proper permissions');
    console.log('\n💡 Try these solutions:');
    console.log('- Wait 2-3 minutes for cluster to fully provision');
    console.log('- Double-check your password in MongoDB Atlas');
    console.log('- Go to Network Access and add 0.0.0.0/0 for all IPs');
    console.log('- Verify database user has "Read and write to any database" permissions');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
};

testConnection(); 