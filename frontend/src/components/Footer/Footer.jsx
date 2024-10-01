import React from 'react';
import './Footer.css';
import { LinkedinOutlined, GithubOutlined } from '@ant-design/icons';
import logo from '../../assets/images/logo.JPG'; // Assicurati di avere il logo corretto

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Colonna: Icone Social */}
        <div className="footer-column social-icons">
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="LinkedIn"
          >
            <LinkedinOutlined className="social-icon-style" />
          </a>
          <a
            href="https://www.github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="GitHub"
          >
            <GithubOutlined className="social-icon-style" />
          </a>
        </div>

        {/* Colonna Centrale: Logo + Nome */}
        <div className="footer-column footer-logo">
          <img src={logo} alt="Travel Mate Logo" className="footer-logo-img" />
          <span className="footer-brand-name">Travel Mate</span>
        </div>

        {/* Colonna: Copyright */}
        <div className="footer-column footer-bottom">
          <p>&copy; {new Date().getFullYear()} Travel Mate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
