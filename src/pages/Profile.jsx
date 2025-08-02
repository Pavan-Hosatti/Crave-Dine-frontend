import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './Profile.css'; // Assuming you have a Profile.css for styling

const Profile = () => {
  const { user, setAuthUser, isAuthenticated } = useAuth(); // Get user and setAuthUser from context

  // State for address data
  const [addressData, setAddressData] = useState({
    houseName: user?.address?.houseName || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false); // State to control address editing mode

  // State for username data
  const [usernameData, setUsernameData] = useState({
    username: user?.username || '',
  });
  const [isEditingUsername, setIsEditingUsername] = useState(false); // State to control username editing mode

  // Update local state if user from context changes
  useEffect(() => {
    if (user) {
      setUsernameData({ username: user.username || '' });
      setAddressData({
        houseName: user.address?.houseName || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'India',
      });
    }
  }, [user]); // Depend on user object from context

  // Handlers for address form fields
  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  // Handler for username form field
  const handleUsernameChange = (e) => {
    setUsernameData({ ...usernameData, [e.target.name]: e.target.value });
  };

  // Handles saving address updates to the backend
  const handleSaveAddress = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');

    if (!isAuthenticated || !user || !token) {
      toast.error("You must be logged in to save your address.");
      return;
    }

    try {
      const BASE_URL_AUTH = import.meta.env.VITE_API_URL + '/auth'; // Using environment variable for backend URL
      const response = await fetch(`${BASE_URL_AUTH}/address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ address: addressData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update address');
      }

      const updatedUser = data.user;
      setAuthUser(updatedUser); // Update user in AuthContext
      localStorage.setItem("userData", JSON.stringify(updatedUser)); // Update localStorage
      toast.success("Address updated successfully!");
      setIsEditingAddress(false); // Exit editing mode
    } catch (error) {
      toast.error(error.message || "Failed to save address. Please try again.");
    }
  };

  // Handles saving username updates to the backend
  const handleSaveUsername = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');

    if (!isAuthenticated || !user || !token) {
      toast.error("You must be logged in to update your username.");
      return;
    }

    try {
      const BASE_URL_AUTH = import.meta.env.VITE_API_URL + '/auth'; // Using environment variable for backend URL
      const response = await fetch(`${BASE_URL_AUTH}/update-username`, { // Backend endpoint for username update
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username: usernameData.username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update username');
      }

      const updatedUser = data.user;
      setAuthUser(updatedUser); // Update user in AuthContext
      localStorage.setItem("userData", JSON.stringify(updatedUser)); // Update localStorage
      toast.success("Username updated successfully!");
      setIsEditingUsername(false); // Exit editing mode
    } catch (error) {
      toast.error(error.message || "Failed to save username. Please try again.");
    }
  };

  // Display message if user is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="profile-container flex items-center justify-center">
        <p className="text-red-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    // Profile UI structure
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 My Profile</h2>

        {/* Username Section */}
        <div className="username-section">
          <h3>Username</h3>
          {!isEditingUsername ? (
            <div className="current-username">
              <p>{user.username || 'N/A'}</p>
              <button onClick={() => setIsEditingUsername(true)} className="edit-btn">Edit Username</button>
            </div>
          ) : (
            <form onSubmit={handleSaveUsername} className="username-form">
              <div className="form-group">
                <label htmlFor="username">New Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={usernameData.username}
                  onChange={handleUsernameChange}
                  required
                />
              </div>
              <div className="username-form-actions">
                <button type="submit" className="save-btn">Save Username</button>
                <button type="button" onClick={() => setIsEditingUsername(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Email Section (Read-only) */}
        <div className="email-section">
          <h3>Email</h3>
          <p>{user.email}</p>
        </div>

        {/* Address Section */}
        <div className="address-section">
          <h3>Delivery Address</h3>
          {user.address && user.address.street && !isEditingAddress ? (
            <div className="current-address">
              <p>{user.address.houseName}</p>
              <p>{user.address.street}</p>
              <p>{user.address.city}, {user.address.state} - {user.address.zipCode}</p>
              <p>{user.address.country}</p>
              <button onClick={() => setIsEditingAddress(true)} className="edit-btn">Edit Address</button>
            </div>
          ) : (
            <form onSubmit={handleSaveAddress} className="address-form">
              <div className="form-group">
                <label htmlFor="houseName">House Name/Number:</label>
                <input
                  type="text"
                  id="houseName"
                  name="houseName"
                  value={addressData.houseName}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="street">Street:</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={addressData.street}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City:</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State:</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={addressData.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code:</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={addressData.zipCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country:</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={addressData.country}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="address-form-actions">
                <button type="submit" className="save-btn">Save Address</button>
                {user.address && user.address.street && <button type="button" onClick={() => setIsEditingAddress(false)} className="cancel-btn">Cancel</button>}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
