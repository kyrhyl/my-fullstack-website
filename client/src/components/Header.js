import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="header">
      <div className="header-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="logo-section">
            <div className="logo-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="logo-text">E-Store</h2>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </div>
        
        <div className="header-right">
          <div className="search-container">
            <div className="search-icon">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="action-buttons">
            <button className="action-button" title="Wishlist">
              <FaHeart />
            </button>
            <Link to="/cart" className="action-button" style={{ position: 'relative' }} title="Cart">
              <FaShoppingBag />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-0.25rem',
                  right: '-0.25rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '0.75rem',
                  borderRadius: '50%',
                  width: '1.25rem',
                  height: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/profile" className="user-avatar" style={{
                  backgroundImage: user.avatar ? `url(${user.avatar})` : 'url(https://via.placeholder.com/40x40?text=U)'
                }} />
                {user.isAdmin && (
                  <Link to="/admin" className="nav-link">Admin</Link>
                )}
                <button onClick={logout} className="nav-link">Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 