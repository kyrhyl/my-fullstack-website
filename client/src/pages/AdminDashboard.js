import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUsers, FaBox, FaShoppingCart, FaChartBar, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ProductManagement from '../components/ProductManagement';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    color: #2c3e50;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  
  .icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .number {
    font-size: 2rem;
    font-weight: bold;
    color: #3498db;
  }
  
  .label {
    color: #7f8c8d;
    margin-top: 0.5rem;
  }
`;

const AdminTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: ${props => props.active ? '#3498db' : 'transparent'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  cursor: pointer;
  border-radius: 5px 5px 0 0;
  
  &:hover {
    background: ${props => props.active ? '#3498db' : '#f8f9fa'};
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/dashboard', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <DashboardContainer>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </DashboardContainer>
    );
  }

  if (loading) {
    return (
      <DashboardContainer>
        <div className="spinner"></div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </Header>

      <StatsGrid>
        <StatCard>
          <div className="icon">
            <FaUsers />
          </div>
          <div className="number">{stats.totalUsers}</div>
          <div className="label">Total Users</div>
        </StatCard>
        
        <StatCard>
          <div className="icon">
            <FaBox />
          </div>
          <div className="number">{stats.totalProducts}</div>
          <div className="label">Total Products</div>
        </StatCard>
        
        <StatCard>
          <div className="icon">
            <FaShoppingCart />
          </div>
          <div className="number">{stats.totalOrders}</div>
          <div className="label">Total Orders</div>
        </StatCard>
        
        <StatCard>
          <div className="icon">
            <FaChartBar />
          </div>
          <div className="number">{stats.recentOrders.length}</div>
          <div className="label">Recent Orders</div>
        </StatCard>
      </StatsGrid>

      <AdminTabs>
        <Tab 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </Tab>
        <Tab 
          active={activeTab === 'products'} 
          onClick={() => setActiveTab('products')}
        >
          Products
        </Tab>
        <Tab 
          active={activeTab === 'orders'} 
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </Tab>
        <Tab 
          active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </Tab>
        <Tab 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </Tab>
      </AdminTabs>

      <TabContent>
        {activeTab === 'dashboard' && (
          <div>
            <h3>Recent Orders</h3>
            {stats.recentOrders.length > 0 ? (
              <div>
                {stats.recentOrders.map(order => (
                  <div key={order._id} style={{ padding: '1rem', border: '1px solid #eee', margin: '0.5rem 0' }}>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Customer:</strong> {order.user?.name}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Total:</strong> ${order.totalPrice}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent orders</p>
            )}
          </div>
        )}
        
        {activeTab === 'products' && (
          <ProductManagement />
        )}
        
        {activeTab === 'orders' && (
          <div>
            <h3>Order Management</h3>
            <p>Order management features coming soon...</p>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div>
            <h3>User Management</h3>
            <p>User management features coming soon...</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div>
            <h3>Admin Settings</h3>
            <p>Admin settings features coming soon...</p>
          </div>
        )}
      </TabContent>
    </DashboardContainer>
  );
};

export default AdminDashboard; 