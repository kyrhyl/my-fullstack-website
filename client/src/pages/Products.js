import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 25px;
  padding: 0.5rem 1rem;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  margin-left: 0.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
`;

const ProductTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.div`
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ProductRating = styled.div`
  color: #f39c12;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.3s;
  
  &:hover {
    background: #2980b9;
  }
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data);
      } else {
        console.error('Failed to fetch products');
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === '' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <ProductsContainer>
        <div className="spinner"></div>
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer>
      <Header>
        <SearchBar>
          <FaSearch />
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        
        <FilterSelect value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="home">Home</option>
        </FilterSelect>
      </Header>

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
          <h3>No products found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      ) : (
        <ProductsGrid>
          {filteredProducts.map(product => (
            <ProductCard key={product._id}>
              <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ProductImage 
                  src={getImageUrl(product.images?.[0])} 
                  alt={product.name} 
                />
                <ProductInfo>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductPrice>${product.price}</ProductPrice>
                  <ProductRating>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} style={{ color: i < Math.floor(product.rating || 0) ? '#f39c12' : '#ddd' }} />
                    ))}
                    <span>({product.rating || 0})</span>
                  </ProductRating>
                </ProductInfo>
              </Link>
              <AddToCartButton onClick={() => handleAddToCart(product)}>
                <FaShoppingCart />
                Add to Cart
              </AddToCartButton>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}
    </ProductsContainer>
  );
};

export default Products; 