import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:4000/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUser({ ...userData, token });
      
    } catch (error) {
      console.error('Errore durante il fetch dei dati utente:', error.message);
      logout();
    } finally {
      setLoading(false); 
    }
  };

  const login = (token) => {
   
    localStorage.setItem('token', token);
    setLoading(true); 
    fetchUserData(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false); 
    navigate('/login');
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      
      fetchUserData(tokenFromStorage);
    } else {
      setLoading(false); 
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
