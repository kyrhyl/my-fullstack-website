import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  &:hover {
    color: #3498db;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #3498db;
  }
`;

const CartIcon = styled(Link)`
  position: relative;
  color: white;
  font-size: 1.2rem;
  text-decoration: none;
  
  &:hover {
    color: #3498db;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  font-weight: bold;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: #e74c3c;
  }
`;

const AdminLink = styled(Link)`
  color: #f39c12;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #e67e22;
  }
`;

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = () => {
    logout();
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">E-Store</Logo>
        
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          
          <CartIcon to="/cart">
            <FaShoppingCart />
            {itemCount > 0 && <CartBadge>{itemCount}</CartBadge>}
          </CartIcon>
          
          {isAuthenticated ? (
            <UserMenu>
              {user?.isAdmin && (
                <AdminLink to="/admin">
                  <FaCog />
                  Admin
                </AdminLink>
              )}
              <NavLink to="/profile">
                <FaUser /> {user?.name}
              </NavLink>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
              </LogoutButton>
            </UserMenu>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 