import React from 'react';
import styled from 'styled-components';

const OrderHistoryContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const OrderHistory = () => {
  return (
    <OrderHistoryContainer>
      <h2>Order History</h2>
      <p>Order history functionality coming soon...</p>
    </OrderHistoryContainer>
  );
};

export default OrderHistory; 