import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios defaults with environment variable
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  axios.defaults.baseURL = apiUrl;

  // Load user on mount
  const loadUser = async () => {
    if (localStorage.getItem('token')) {
      try {
        const res = await axios.get('/api/auth/user', {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        
        // Add isAdmin property to user object
        const userWithAdmin = {
          ...res.data,
          isAdmin: res.data.role === 'admin' || res.data.role === 'superadmin'
        };
        
        dispatch({ type: 'USER_LOADED', payload: userWithAdmin });
      } catch (err) {
        dispatch({ type: 'AUTH_ERROR' });
        localStorage.removeItem('token');
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      
      // Add isAdmin property to user object
      const userWithAdmin = {
        ...res.data,
        isAdmin: res.data.role === 'admin' || res.data.role === 'superadmin'
      };
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: userWithAdmin });
      toast.success('Registration successful!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      toast.error(message);
      dispatch({ type: 'REGISTER_FAIL' });
      return { success: false, message };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      
      // Add isAdmin property to user object
      const userWithAdmin = {
        ...res.data.user,
        isAdmin: res.data.user.role === 'admin' || res.data.user.role === 'superadmin'
      };
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token: res.data.token, user: userWithAdmin } });
      toast.success('Login successful!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      toast.error(message);
      dispatch({ type: 'LOGIN_FAIL' });
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.info('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/users/profile', profileData, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      // Add isAdmin property to user object
      const userWithAdmin = {
        ...res.data,
        isAdmin: res.data.role === 'admin' || res.data.role === 'superadmin'
      };
      
      dispatch({ type: 'USER_LOADED', payload: userWithAdmin });
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      register,
      login,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 