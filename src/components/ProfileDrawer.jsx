import React from 'react';
import './ProfileDrawer.css';
import { useAuth } from '../context/AuthContext';
import Profile from '../pages/Profile'; // ✅ use the original Profile component

const ProfileDrawer = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className={`profile-drawer-overlay ${isOpen ? 'open' : ''}`}>
      <div className="profile-drawer-panel">
        <div className="drawer-header">
          <h2>👤 Profile</h2>
          <span className="drawer-close" onClick={onClose}>×</span>
        </div>
        <div className="drawer-body">
          {isAuthenticated && user ? (
            <Profile /> // ✅ Render the full profile component inside the drawer
          ) : (
            <p className="text-red-500">Please log in to view profile.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;
