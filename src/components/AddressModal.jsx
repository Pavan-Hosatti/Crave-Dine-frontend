// src/components/AddressModal.jsx
import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';
import './AddressModal.css'; 

const AddressModal = ({ isOpen, onClose, onSaveAddress, initialAddress }) => {
  // State to hold the address form data
  const [address, setAddress] = useState({
    houseName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India', // Default to India
  });

  // Populate form fields if an initial address is provided (for editing)
  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    } else {
      // Clear form if no initial address (for new entry)
      setAddress({
        houseName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      });
    }
  }, [initialAddress, isOpen]); // Reset when modal opens or initialAddress changes

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prevAddress => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => { 
    e.preventDefault();

    // Basic validation
    if (!address.houseName || !address.street || !address.city || !address.state || !address.zipCode) {
      toast.error("Please fill in all required address fields.");
      return;
    }

    // Call the onSaveAddress prop with the collected data
   
    onSaveAddress(address);
    // Modal will be closed by parent after successful save
  };

  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal-header">
          <h2>{initialAddress ? 'Update Delivery Address' : 'Enter Delivery Address'}</h2>
          <button className="close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-group">
            <label htmlFor="houseName">House Name/Number:</label>
            <input
              type="text"
              id="houseName"
              name="houseName"
              value={address.houseName}
              onChange={handleChange}
              placeholder="e.g., Flat 101, Building A"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="street">Street/Area:</label>
            <input
              type="text"
              id="street"
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="e.g., MG Road, Koramangala"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="e.g., Bengaluru"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              placeholder="e.g., Karnataka"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="zipCode">Zip Code:</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={address.zipCode}
              onChange={handleChange}
              placeholder="e.g., 560001"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
              onChange={handleChange}
              placeholder="e.g., India"
              readOnly
            />
          </div>
          <button type="submit" className="save-address-btn">
            {initialAddress ? 'Update Address' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
