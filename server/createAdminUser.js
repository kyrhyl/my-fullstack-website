const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ecommerce_user:ecommerce123@my-ecommerce-db.6gfovmu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=my-ecommerce-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Check if admin user exists
    let adminUser = await User.findOne({ email: 'admin@estore.com' });
    
    if (adminUser) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@estore.com');
      console.log('🔑 Password: admin123');
    } else {
      // Create admin user with proper password hashing
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@estore.com',
        password: 'admin123', // This will be hashed by the User model
        role: 'admin',
        permissions: [
          'manage_products',
          'manage_orders', 
          'manage_users',
          'view_analytics',
          'manage_settings'
        ]
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@estore.com');
      console.log('🔑 Password: admin123');
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

createAdminUser(); 