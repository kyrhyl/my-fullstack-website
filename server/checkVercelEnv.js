require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Checking Vercel Environment Variables...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
console.log('PORT:', process.env.PORT || 'not set');

if (process.env.MONGODB_URI) {
  console.log('\n🔗 Testing MongoDB Connection...');
  
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    
    // Test basic operations
    return mongoose.connection.db.admin().listDatabases();
  })
  .then((result) => {
    console.log('✅ Database operations working');
    console.log('Available databases:', result.databases.map(db => db.name));
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error:', error.message);
    console.error('\nPossible issues:');
    console.error('1. MONGODB_URI is incorrect');
    console.error('2. Network access not allowed from Vercel');
    console.error('3. MongoDB Atlas IP whitelist needs to be updated');
    console.error('4. Database user credentials are wrong');
    process.exit(1);
  });
} else {
  console.log('\n❌ MONGODB_URI is not set!');
  console.log('\nTo fix this:');
  console.log('1. Go to your Vercel dashboard');
  console.log('2. Select your project');
  console.log('3. Go to Settings > Environment Variables');
  console.log('4. Add MONGODB_URI with your MongoDB Atlas connection string');
  console.log('5. Redeploy your project');
} 