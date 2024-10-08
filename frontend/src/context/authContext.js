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
  const [tokenExpirationTimeout, setTokenExpirationTimeout] = useState(null); 

  
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); 
    } catch (error) {
      console.error('Errore durante la decodifica del token:', error);
      return true; 
    }
  };

  
  const login = (token) => {
    localStorage.setItem('token', token);
    setLoading(true);
    fetchUserData(token);
    setupTokenExpirationCheck(token); 
  };

  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
    navigate('/login');
    clearTimeout(tokenExpirationTimeout); 
  };

  
  const setupTokenExpirationCheck = (token) => {
    try {
      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp * 1000 - Date.now(); 

      if (expirationTime > 0) {
        const timeout = setTimeout(() => {
          logout(); 
        }, expirationTime);

        setTokenExpirationTimeout(timeout); 
      } else {
        logout(); 
      }
    } catch (error) {
      console.error('Errore durante l\'impostazione del controllo di scadenza del token:', error);
      logout(); 
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

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');

    if (tokenFromStorage) {
      if (isTokenExpired(tokenFromStorage)) {
        logout(); 
      } else {
        fetchUserData(tokenFromStorage); 
        setupTokenExpirationCheck(tokenFromStorage); 
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
