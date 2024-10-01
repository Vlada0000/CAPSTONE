import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Spin } from 'antd'; 

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Mostra un loader mentre aspettiamo il caricamento dello stato di autenticazione
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  

  // Se l'utente è autenticato, mostra il contenuto, altrimenti reindirizza al login
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
