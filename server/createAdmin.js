const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin user exists
    let adminUser = await User.findOne({ email: 'admin@estore.com' });
    
    if (adminUser) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@estore.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role:', adminUser.role);
      console.log('🔐 Permissions:', adminUser.permissions);
    } else {
      // Create admin user
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@estore.com',
        password: 'admin123',
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
      console.log('👤 Role: admin');
      console.log('🔐 Permissions:', adminUser.permissions);
    }

    console.log('\n🌐 You can now login at: http://localhost:3000/login');
    console.log('🔗 Admin Dashboard: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createAdmin(); 