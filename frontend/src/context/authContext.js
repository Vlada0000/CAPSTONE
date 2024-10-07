import { createContext, useContext, useEffect, useState } from 'react';
import { getLoggedInUserProfile } from '../api/userApi';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      
      if (decoded.exp * 1000 < Date.now()) {
        return true; 
      }
      return false; 
    } catch (error) {
      console.error('Errore durante la decodifica del token:', error);
      return true; 
    }
  };

  const fetchUserData = async (token) => {
    try {
      const userData = await getLoggedInUserProfile(token); 
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
     
      if (isTokenExpired(tokenFromStorage)) {
        logout(); 
      } else {
        fetchUserData(tokenFromStorage); 
      }
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
