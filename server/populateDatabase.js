const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const mockProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium wireless headphones with noise cancellation, 30-hour battery life, and crystal-clear sound quality.",
    price: 129.99,
    category: "electronics",
    stock: 45,
    brand: "SoundMax",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
    ],
    rating: 4.5,
    featured: true
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring, GPS tracking, and 7-day battery life.",
    price: 199.99,
    category: "electronics",
    stock: 32,
    brand: "FitTech",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
    ],
    rating: 4.3,
    featured: true
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and breathable organic cotton t-shirt. Available in multiple colors and sizes.",
    price: 24.99,
    category: "clothing",
    stock: 120,
    brand: "EcoWear",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"
    ],
    rating: 4.2
  },
  {
    name: "Denim Jeans",
    description: "Classic blue denim jeans with perfect fit and durability. Made from high-quality cotton denim.",
    price: 59.99,
    category: "clothing",
    stock: 85,
    brand: "DenimCo",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop"
    ],
    rating: 4.4
  },
  {
    name: "The Art of Programming",
    description: "Comprehensive guide to modern programming practices. Covers multiple languages and best practices.",
    price: 39.99,
    category: "books",
    stock: 25,
    brand: "TechBooks",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop"
    ],
    rating: 4.7,
    featured: true
  }
];

const populateDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ecommerce_user:ecommerce123@my-ecommerce-db.6gfovmu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=my-ecommerce-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Create admin user
    let adminUser = await User.findOne({ email: 'admin@estore.com' });
    if (!adminUser) {
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
    } else {
      console.log('✅ Admin user already exists');
    }

    // Add sample products
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      await Product.insertMany(mockProducts);
      console.log(`✅ Added ${mockProducts.length} sample products`);
    } else {
      console.log(`✅ Database already has ${existingProducts} products`);
    }

    console.log('\n📧 Admin Login: admin@estore.com');
    console.log('🔑 Password: admin123');
    console.log('🌐 Website: http://localhost:3000');
    console.log('🔗 Admin Dashboard: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
};

populateDatabase(); 