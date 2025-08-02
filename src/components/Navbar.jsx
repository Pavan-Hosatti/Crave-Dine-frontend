// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { data } from '../pages/restApi.json';

import { useAuth } from '../context/AuthContext';

import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handleProfileClick = () => {
    setRedirecting(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 400);
  };

  const closeMenu = () => setMenuOpen(false);

  const renderLink = (element, i) =>
    isHome ? (
      <ScrollLink
        key={element.id}
        to={element.link}
        spy
        smooth
        duration={500}
        offset={-70}
        onClick={closeMenu}
        className="slide-link"
        style={{ animationDelay: `${i * 0.1}s` }}
      >
        {element.title}
      </ScrollLink>
    ) : (
      <RouterLink
        key={element.id}
        to={`/#${element.link}`}
        onClick={closeMenu}
        className="slide-link"
        style={{ animationDelay: `${i * 0.1}s` }}
      >
        {element.title}
      </RouterLink>
    );

  return (
    <>
      {/* --- Desktop Navbar --- */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">Crave & Dine</div>
        </div>

        <div className="desktop-links">
          <div className="scroll-links">
            {data[0].navbarLinks.map(renderLink)}
          </div>

          <RouterLink to="/menu" className="menu-btn">OUR MENU</RouterLink>

{isAuthenticated ? (
  <div className="profile-icon" onClick={handleProfileClick} title="Go to Dashboard">
    {user?.username?.[0]?.toUpperCase()}
   
  </div>
) : (
  <div className="auth-buttons">
    <div className="auth-btn" onClick={() => navigate('/login')}>Login</div>
  
  </div>
)}


        </div>

        <div className="hamburger" onClick={() => setMenuOpen(true)}>
          <GiHamburgerMenu />
        </div>
      </nav>

      {/* --- Sidebar Overlay --- */}
      <div className={`nav-overlay ${menuOpen ? 'show' : ''}`} onClick={closeMenu} />

      {/* --- Mobile Sidebar --- */}
{/* --- Mobile Sidebar --- */}
<div className={`mobile-slide-panel ${menuOpen ? 'open' : ''}`}>

  {/* --- Header with only the Close button --- */}
  <div className="mobile-slide-header">
    <div className="slide-close-icon" onClick={closeMenu}>
      <IoClose />
    </div>
  </div>

  {/* --- Main navigation links --- */}
  <div className="mobile-slide-links">
    {data[0].navbarLinks.map(renderLink)}
    <RouterLink to="/menu" className="menu-btn" onClick={closeMenu}>
      Browse Menu →
    </RouterLink>
  </div>

  {/* --- Bottom section --- */}
  {isAuthenticated ? (
    <div className="profile-box">
      <div 
        className="profile-letter-box"
        onClick={() => {
          closeMenu();
          handleProfileClick();
        }}
      >
        {user?.username?.[0].toUpperCase()}
      </div>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  ) : (
    <div className="auth-buttons-mobile">
      <div className="auth-btn-mob" onClick={() => {
        closeMenu();
        navigate('/login');
      }}>
        Login
      </div>
     
    </div>
  )}
</div>




      {/* --- Page Transition Overlay --- */}
     
    </>
  );
};

export default Navbar;
