// src/components/Footer.jsx
import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaWhatsapp, FaLinkedinIn, FaGithub} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
       
        <div className="footer-col contact-info">
          <div className="contact-item">
            <div className="contact-icon"><FaMapMarkerAlt /></div>
            <p className="contact-text">
              TC Palya, KR Puram, Bengaluru, Karnataka, India
            </p>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><FaPhoneAlt /></div>
            <p className="contact-text">
              <a href="tel:+916363840929">+91 6363840929</a>
            </p>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><FaEnvelope /></div>
            <p className="contact-text">
              <a href="mailto:pavan876p3s@gmail.com">pavan876p3s@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Right Column: About Company & Social Media */}
        <div className="footer-col about-company">
          <h4 className="about-company-heading">About the company</h4>
          <p className="about-company-text">
            At Crave & Dine, we offer a variety of delicious, freshly prepared dishes in a warm, inviting atmosphere. Our goal is to create memorable dining experiences with exceptional service and quality ingredients.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaWhatsapp /></a>
       
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
