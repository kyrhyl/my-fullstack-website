const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ecommerce_user:ecommerce123@my-ecommerce-db.6gfovmu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=my-ecommerce-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@estore.com' });
    
    if (admin) {
      console.log('✅ Found admin user');
      
      // Reset password to admin123
      admin.password = 'admin123';
      await admin.save();
      
      console.log('✅ Admin password reset successfully');
      console.log('📧 Email: admin@estore.com');
      console.log('🔑 New Password: admin123');
      console.log('👤 Role:', admin.role);
      console.log('🔐 Permissions:', admin.permissions);
    } else {
      console.log('❌ Admin user not found');
    }

    console.log('\n🌐 You can now login at: http://localhost:3000/login');
    console.log('🔗 Admin Dashboard: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
};

resetAdminPassword(); 