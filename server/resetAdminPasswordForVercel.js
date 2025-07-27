const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const resetAdminPasswordForVercel = async () => {
  try {
    // Connect to MongoDB Atlas (production database)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ecommerce_user:ecommerce123@my-ecommerce-db.6gfovmu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=my-ecommerce-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas (Production)');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@estore.com' });
    
    if (admin) {
      console.log('✅ Found admin user in production');
      
      // Reset password to admin123
      admin.password = 'admin123';
      await admin.save();
      
      console.log('✅ Admin password reset successfully in production');
      console.log('📧 Email: admin@estore.com');
      console.log('🔑 New Password: admin123');
      console.log('👤 Role:', admin.role);
      console.log('🔐 Permissions:', admin.permissions);
    } else {
      console.log('❌ Admin user not found in production');
    }

    console.log('\n🌐 You can now login at your Vercel URL');
    console.log('📧 Email: admin@estore.com');
    console.log('🔑 Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
};

resetAdminPasswordForVercel(); 