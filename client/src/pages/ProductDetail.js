import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaStar, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';

const ProductDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
`;

const ProductInfo = styled.div`
  h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }
  
  .price {
    color: #e74c3c;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .description {
    color: #7f8c8d;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  .stars {
    color: #f39c12;
  }
  
  .rating-text {
    color: #7f8c8d;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  button {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
    
    &:hover {
      background: #2980b9;
    }
  }
  
  span {
    font-size: 1.2rem;
    font-weight: bold;
    min-width: 30px;
    text-align: center;
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.3s;
  
  &:hover {
    background: #c0392b;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        console.error('Failed to fetch product');
        toast.error('Failed to load product details');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <ProductDetailContainer>
        <div className="spinner"></div>
      </ProductDetailContainer>
    );
  }

  if (!product) {
    return (
      <ProductDetailContainer>
        <h2>Product not found</h2>
      </ProductDetailContainer>
    );
  }

  return (
    <ProductDetailContainer>
      <ProductGrid>
        <ProductImage 
          src={getImageUrl(product.images?.[0])} 
          alt={product.name} 
        />
        
        <ProductInfo>
          <h1>{product.name}</h1>
          <div className="price">${product.price}</div>
          
          <Rating>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} style={{ color: i < Math.floor(product.rating || 0) ? '#f39c12' : '#ddd' }} />
              ))}
            </div>
            <span className="rating-text">({product.rating || 0})</span>
          </Rating>
          
          <div className="description">{product.description}</div>
          
          <QuantitySelector>
            <button onClick={() => handleQuantityChange(-1)}>
              <FaMinus />
            </button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange(1)}>
              <FaPlus />
            </button>
          </QuantitySelector>
          
          <AddToCartButton onClick={handleAddToCart}>
            <FaShoppingCart />
            Add to Cart
          </AddToCartButton>
        </ProductInfo>
      </ProductGrid>
    </ProductDetailContainer>
  );
};

export default ProductDetail; 