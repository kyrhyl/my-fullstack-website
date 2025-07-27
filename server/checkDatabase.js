const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const checkDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ecommerce_user:ecommerce123@my-ecommerce-db.6gfovmu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=my-ecommerce-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Check existing users
    const users = await User.find();
    console.log(`📊 Total users in database: ${users.length}`);
    
    users.forEach(user => {
      console.log(`👤 User: ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Check if admin exists
    const admin = await User.findOne({ email: 'admin@estore.com' });
    if (admin) {
      console.log('✅ Admin user exists');
      console.log('📧 Email: admin@estore.com');
      console.log('👤 Role:', admin.role);
      console.log('🔐 Permissions:', admin.permissions);
    } else {
      console.log('❌ Admin user not found - creating...');
      
      // Create admin user
      const newAdmin = new User({
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
      
      await newAdmin.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@estore.com');
      console.log('🔑 Password: admin123');
    }

    // Check products
    const products = await Product.find();
    console.log(`📦 Total products in database: ${products.length}`);

    console.log('\n🌐 You can now login at: http://localhost:3000/login');
    console.log('🔗 Admin Dashboard: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
};

checkDatabase(); 