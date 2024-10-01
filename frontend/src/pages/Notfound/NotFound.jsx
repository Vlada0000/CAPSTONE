// src/components/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Assicurati di avere react-router-dom installato
import notFoundImage from '../../assets/images/notfound.jpg'; // Importa l'immagine
import './NotFound.css'; // Importa il file CSS per lo stile

const NotFound = () => {
  return (
    <div className="not-found-page">
      <img src={notFoundImage} alt="Not Found" className="background-image " />
      <div className="content">
        <h1 className="exo-title">404</h1>
        <p className="exo-content">Page Not Found</p>
        <Link to="/" className="back-home-link exo-light">Go Back Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
