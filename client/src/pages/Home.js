import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // Use the same base URL logic as other components
    const baseURL = process.env.NODE_ENV === 'production' 
      ? '' // In production, API calls go to the same domain
      : 'http://localhost:5001'; // In development, use localhost:5001
    
    const response = await fetch(`${baseURL}/api/products?limit=4`);
      
      if (response.ok) {
        const data = await response.json();
        setFeaturedProducts(data.products || data);
      } else {
        console.error('Failed to fetch featured products');
        toast.error('Failed to load featured products');
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      toast.error('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Latest gadgets and electronics"
    },
    {
      name: "Clothing",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Fashion and apparel"
    },
    {
      name: "Home & Garden",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Home improvement and decor"
    },
    {
      name: "Sports",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Sports equipment and gear"
    },
    {
      name: "Books",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Books and literature"
    },
    {
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Beauty and personal care"
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2.5rem' }}>
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to E-Store
            </h1>
            <h2 className="hero-subtitle">
              Discover amazing products at unbeatable prices. Shop the latest trends and find everything you need in one place.
            </h2>
            <Link to="/products" className="cta-button">
              Shop Now <FaArrowRight style={{ marginLeft: '0.5rem' }} />
            </Link>
          </div>
        </div>

        {/* Featured Products */}
        <h2 className="section-header" style={{ paddingLeft: '1rem' }}>Featured Products</h2>
        <div className="featured-products">
          {loading ? (
            <div className="spinner"></div>
          ) : featuredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <p>No products available yet. Check back soon!</p>
            </div>
          ) : (
            featuredProducts.map(product => (
              <div key={product._id} className="featured-product">
                <div 
                  className="featured-product-image"
                  style={{
                    backgroundImage: `url(${getImageUrl(product.images?.[0])})`
                  }}
                />
                <div>
                  <p className="featured-product-title">{product.name}</p>
                  <p className="featured-product-description">{product.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Shop by Category */}
        <h2 className="section-header" style={{ paddingLeft: '1rem' }}>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-item">
              <div 
                className="category-image"
                style={{
                  backgroundImage: `url(${category.image})`
                }}
              />
              <p className="category-name">{category.name}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div style={{ padding: '3rem 0' }}>
          <h2 className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>Why Choose Us</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            padding: '0 1rem'
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#0e141b', marginBottom: '1rem' }}>Free Shipping</h3>
              <p style={{ color: '#4e7397', lineHeight: '1.6' }}>
                Free shipping on orders over $50. Fast and reliable delivery to your doorstep.
              </p>
            </div>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#0e141b', marginBottom: '1rem' }}>Quality Products</h3>
              <p style={{ color: '#4e7397', lineHeight: '1.6' }}>
                We only sell high-quality products from trusted brands and manufacturers.
              </p>
            </div>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#0e141b', marginBottom: '1rem' }}>24/7 Support</h3>
              <p style={{ color: '#4e7397', lineHeight: '1.6' }}>
                Our customer support team is available 24/7 to help you with any questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 