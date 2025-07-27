import React from 'react';
import styled from 'styled-components';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  gap: 1rem;
  
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  .price {
    color: #e74c3c;
    font-weight: bold;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  button {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    cursor: pointer;
  }
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
`;

const Cart = () => {
  const { items, total, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <CartContainer>
        <h2>Your cart is empty</h2>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <h2>Shopping Cart</h2>
      {items.map(item => (
        <CartItem key={item._id}>
          <img src={item.image} alt={item.name} />
          <ItemInfo>
            <h3>{item.name}</h3>
            <div className="price">${item.price}</div>
          </ItemInfo>
          <QuantityControl>
            <button onClick={() => updateQuantity(item._id, item.qty - 1)}>
              <FaMinus />
            </button>
            <span>{item.qty}</span>
            <button onClick={() => updateQuantity(item._id, item.qty + 1)}>
              <FaPlus />
            </button>
          </QuantityControl>
          <RemoveButton onClick={() => removeFromCart(item._id)}>
            <FaTrash />
          </RemoveButton>
        </CartItem>
      ))}
      <div style={{ textAlign: 'right', marginTop: '2rem' }}>
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>
    </CartContainer>
  );
};

export default Cart; 