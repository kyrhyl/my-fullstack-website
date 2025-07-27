import React, { useState, useEffect } from 'react';
import { FaDatabase, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const DatabaseStatus = () => {
  const [status, setStatus] = useState({
    loading: true,
    connected: false,
    error: null,
    stats: null
  });

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      
      setStatus({
        loading: false,
        connected: data.database?.connected || false,
        error: null,
        stats: data.stats
      });
    } catch (error) {
      setStatus({
        loading: false,
        connected: false,
        error: error.message,
        stats: null
      });
    }
  };

  if (status.loading) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#f8f9fa',
        padding: '10px 15px',
        borderRadius: '5px',
        border: '1px solid #dee2e6',
        fontSize: '12px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <FaDatabase style={{ color: '#6c757d' }} />
        <span>Checking database...</span>
      </div>
    );
  }

  if (status.connected) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#d4edda',
        color: '#155724',
        padding: '10px 15px',
        borderRadius: '5px',
        border: '1px solid #c3e6cb',
        fontSize: '12px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        maxWidth: '300px'
      }}>
        <FaCheckCircle style={{ color: '#28a745' }} />
        <div>
          <div style={{ fontWeight: 'bold' }}>✅ Database Connected</div>
          {status.stats && (
            <div style={{ fontSize: '10px', marginTop: '2px' }}>
              Users: {status.stats.users} | Products: {status.stats.products}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f8d7da',
      color: '#721c24',
      padding: '10px 15px',
      borderRadius: '5px',
      border: '1px solid #f5c6cb',
      fontSize: '12px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <FaTimesCircle style={{ color: '#dc3545' }} />
      <div>
        <div style={{ fontWeight: 'bold' }}>❌ Database Disconnected</div>
        {status.error && (
          <div style={{ fontSize: '10px', marginTop: '2px' }}>
            Error: {status.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseStatus; 