const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminForVercel = async () => {
  try {
    // Connect to MongoDB Atlas (production database)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ecommerce_user:ecommerce123@my-ecommerce-db.6gfovmu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=my-ecommerce-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas (Production)');

    // Check if admin user exists
    let adminUser = await User.findOne({ email: 'admin@estore.com' });
    
    if (adminUser) {
      console.log('✅ Admin user already exists in production');
      console.log('📧 Email: admin@estore.com');
      console.log('👤 Role:', adminUser.role);
      console.log('🔐 Permissions:', adminUser.permissions);
    } else {
      console.log('❌ Admin user not found - creating in production...');
      
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
      console.log('✅ Admin user created successfully in production!');
      console.log('📧 Email: admin@estore.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin');
      console.log('🔐 Permissions:', adminUser.permissions);
    }

    console.log('\n🌐 You can now login at your Vercel URL');
    console.log('🔗 Example: https://your-app-name.vercel.app/login');
    console.log('📧 Email: admin@estore.com');
    console.log('🔑 Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
};

createAdminForVercel(); 