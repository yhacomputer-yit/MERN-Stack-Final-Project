import { createContext, useState, useEffect, useContext } from 'react';
import { login, register } from '../lib/api';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          console.log('Fetching user from /api/auth/me with token:', token);
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Invalid token');
          const userData = await response.json();
          const decoded = jwtDecode(token);
          setUser({ ...userData, token, isAdmin: decoded.role === 'admin' });
          console.log('User set:', userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token');
          setUser(null);
          toast.error('Session expired, please log in again');
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Logging in:', { email });
      const response = await login({ email, password });
      const { token, user: userData } = response;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser({ ...userData, token, isAdmin: decoded.role === 'admin' });
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('Registering:', { name, email });
      const response = await register({ name, email, password });
      const { token, user: userData } = response;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser({ ...userData, token, isAdmin: decoded.role === 'admin' });
      toast.success('Registered successfully');
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);