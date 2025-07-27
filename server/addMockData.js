const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const mockProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium wireless headphones with noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals.",
    price: 129.99,
    category: "electronics",
    stock: 45,
    brand: "SoundMax",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop"
    ],
    rating: 4.5,
    featured: true
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring, GPS tracking, and 7-day battery life. Tracks steps, calories, and sleep patterns.",
    price: 199.99,
    category: "electronics",
    stock: 32,
    brand: "FitTech",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=500&fit=crop"
    ],
    rating: 4.3,
    featured: true
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and breathable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.",
    price: 24.99,
    category: "clothing",
    stock: 120,
    brand: "EcoWear",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=500&fit=crop"
    ],
    rating: 4.2
  },
  {
    name: "Denim Jeans",
    description: "Classic blue denim jeans with perfect fit and durability. Made from high-quality cotton denim with stretch comfort.",
    price: 59.99,
    category: "clothing",
    stock: 85,
    brand: "DenimCo",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop"
    ],
    rating: 4.4
  },
  {
    name: "The Art of Programming",
    description: "Comprehensive guide to modern programming practices. Covers multiple languages and best practices for software development.",
    price: 39.99,
    category: "books",
    stock: 25,
    brand: "TechBooks",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop"
    ],
    rating: 4.7,
    featured: true
  },
  {
    name: "Coffee Table Book - Photography",
    description: "Beautiful coffee table book featuring stunning photography from around the world. Perfect for home decoration and inspiration.",
    price: 49.99,
    category: "books",
    stock: 15,
    brand: "ArtBooks",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop"
    ],
    rating: 4.6
  },
  {
    name: "Smart Coffee Maker",
    description: "Programmable coffee maker with built-in grinder and smartphone connectivity. Brews perfect coffee every time.",
    price: 149.99,
    category: "home",
    stock: 28,
    brand: "BrewTech",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&h=500&fit=crop"
    ],
    rating: 4.4,
    featured: true
  },
  {
    name: "Modern Floor Lamp",
    description: "Contemporary floor lamp with adjustable brightness and color temperature. Perfect for living rooms and home offices.",
    price: 89.99,
    category: "home",
    stock: 18,
    brand: "LightCo",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop"
    ],
    rating: 4.1
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat made from eco-friendly materials. Perfect thickness for comfort and stability during practice.",
    price: 34.99,
    category: "sports",
    stock: 65,
    brand: "YogaLife",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop"
    ],
    rating: 4.3
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with superior cushioning and breathable mesh upper. Ideal for long-distance running.",
    price: 89.99,
    category: "sports",
    stock: 42,
    brand: "RunFast",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop"
    ],
    rating: 4.5
  },
  {
    name: "Natural Face Cream",
    description: "Hydrating face cream with natural ingredients. Suitable for all skin types and provides 24-hour moisture.",
    price: 29.99,
    category: "beauty",
    stock: 55,
    brand: "NaturalBeauty",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop"
    ],
    rating: 4.2
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision gaming mouse with customizable RGB lighting and programmable buttons. Perfect for gamers.",
    price: 79.99,
    category: "electronics",
    stock: 38,
    brand: "GameTech",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1615664445854-b6bb5b9f2f8a?w=500&h=500&fit=crop"
    ],
    rating: 4.6
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Waterproof portable speaker with 360-degree sound and 12-hour battery life. Perfect for outdoor activities.",
    price: 69.99,
    category: "electronics",
    stock: 52,
    brand: "SoundWave",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop"
    ],
    rating: 4.4
  },
  {
    name: "Leather Wallet",
    description: "Genuine leather wallet with RFID protection and multiple card slots. Classic design with modern functionality.",
    price: 44.99,
    category: "clothing",
    stock: 30,
    brand: "LeatherCraft",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
    ],
    rating: 4.3
  },
  {
    name: "Kitchen Knife Set",
    description: "Professional-grade knife set with wooden block storage. Includes chef's knife, paring knife, and utility knife.",
    price: 119.99,
    category: "home",
    stock: 22,
    brand: "ChefTools",
    images: [
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop"
    ],
    rating: 4.7
  }
];

async function addMockData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});
    // console.log('🗑️  Cleared existing products');
    
    // Add mock products
    const addedProducts = [];
    for (const productData of mockProducts) {
      try {
        const product = new Product(productData);
        await product.save();
        addedProducts.push(product);
        console.log(`✅ Added: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to add ${productData.name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Successfully added ${addedProducts.length} products to the catalog!`);
    console.log('\n📊 Product Summary:');
    
    // Show summary by category
    const categories = {};
    addedProducts.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });
    
    console.log('\n🌐 You can now view these products at:');
    console.log('  - Home page: http://localhost:3000');
    console.log('  - Products page: http://localhost:3000/products');
    console.log('  - Admin dashboard: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addMockData(); 