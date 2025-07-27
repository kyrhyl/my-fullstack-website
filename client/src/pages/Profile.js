import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <ProfileContainer>
        <h2>Please login to view your profile</h2>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </ProfileContainer>
  );
};

export default Profile; 