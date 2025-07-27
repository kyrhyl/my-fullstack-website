import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';

const HomeContainer = styled.div`
  min-height: 100vh;
`;

const Hero = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: #e74c3c;
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background 0.3s;
  
  &:hover {
    background: #c0392b;
  }
`;

const Features = styled.section`
  padding: 4rem 2rem;
  background: #f8f9fa;
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  
  h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }
  
  p {
    color: #7f8c8d;
    line-height: 1.6;
  }
`;

const FeaturedProducts = styled.section`
  padding: 4rem 2rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 3rem;
  font-size: 2.5rem;
`;

const ProductsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1rem;
  
  h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  .price {
    color: #e74c3c;
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .rating {
    color: #f39c12;
    margin: 0.5rem 0;
  }
`;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products?limit=4');
      
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

  return (
    <HomeContainer>
      <Hero>
        <HeroContent>
          <h1>Welcome to E-Store</h1>
          <p>Discover amazing products at unbeatable prices. Shop the latest trends and find everything you need in one place.</p>
          <CTAButton to="/products">
            Shop Now <FaArrowRight style={{ marginLeft: '0.5rem' }} />
          </CTAButton>
        </HeroContent>
      </Hero>

      <Features>
        <SectionTitle>Why Choose Us</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <h3>Free Shipping</h3>
            <p>Free shipping on orders over $50. Fast and reliable delivery to your doorstep.</p>
          </FeatureCard>
          <FeatureCard>
            <h3>Quality Products</h3>
            <p>We only sell high-quality products from trusted brands and manufacturers.</p>
          </FeatureCard>
          <FeatureCard>
            <h3>24/7 Support</h3>
            <p>Our customer support team is available 24/7 to help you with any questions.</p>
          </FeatureCard>
        </FeaturesGrid>
      </Features>

      <FeaturedProducts>
        <SectionTitle>Featured Products</SectionTitle>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner"></div>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
            <p>No products available yet. Check back soon!</p>
          </div>
        ) : (
          <ProductsGrid>
            {featuredProducts.map(product => (
              <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: 'none' }}>
                <ProductCard>
                  <ProductImage 
                    src={getImageUrl(product.images?.[0])} 
                    alt={product.name} 
                  />
                  <ProductInfo>
                    <h3>{product.name}</h3>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} style={{ color: i < Math.floor(product.rating || 0) ? '#f39c12' : '#ddd' }} />
                      ))}
                      <span style={{ marginLeft: '0.5rem' }}>({product.rating || 0})</span>
                    </div>
                    <div className="price">${product.price}</div>
                  </ProductInfo>
                </ProductCard>
              </Link>
            ))}
          </ProductsGrid>
        )}
      </FeaturedProducts>
    </HomeContainer>
  );
};

export default Home; 