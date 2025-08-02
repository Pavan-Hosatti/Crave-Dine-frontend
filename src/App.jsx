// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

// Import global styles (if any)
import './App.css';

// Import components that are now separate files
import AuthProvider, { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import CartIcon from './components/CartIcon';
import CartModal from './components/CartModal';
import AddressModal from './components/AddressModal';
import Home from './pages/Home';
import Success from './pages/success';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Menu from './components/Menu';
import { CartProvider, useCart } from './context/CartContext';
import Footer from './components/Footer.jsx'

const VITE_API_BASE_URL = import.meta.env.VITE_API_URL;

export default function App() {
  return (
    <>
   
      <Toaster position="top-center" reverseOrder={false} />

      {/* CartProvider should wrap AuthProvider, and only appear once */}
      <CartProvider>
        <AuthProvider>

            <MainAppContent />
        
        </AuthProvider>
      </CartProvider>
    </>
  );
}

// Main application content that consumes AuthContext and CartContext
const MainAppContent = () => {
  const {
    user,
    isAuthenticated,
    loading,
    firebaseReady,
    setAuthUser,
  } = useAuth();

  const { cartItems, cartTotal, clearCart } = useCart();

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModal] = useState(false);


  const handlePlaceOrder = useCallback(() => {
    // This function will primarily ensure user is logged in and has an address
    // before allowing them to proceed to the Checkout component logic (which is in CartModal).
    if (!isAuthenticated || !user) {
      toast.error("Please log in or sign up to place an order.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    if (!user.address || Object.keys(user.address).length === 0 || !user.address.street) {
      setIsAddressModal(true);
      toast("Please provide your delivery address.", { icon: '📍' });
      return;
    }

    // If all checks pass, the CartModal's internal Checkout component will handle payment.
    // No direct payment API calls here.
    setIsCartModalOpen(true); // Re-open cart modal if it was closed, to show Checkout component
  }, [isAuthenticated, user, cartItems]);


  const saveAddress = useCallback(async (addressData) => {
  
    const token = localStorage.getItem('jwtToken');

    if (!user || !token) {
      toast.error("Please log in to save your address.");

      return;
    }

    try {
      if (!VITE_API_BASE_URL) { // Use the consistent base URL
        
        toast.error("Server URL not configured.");
        return;
      }
      
    


      const response = await fetch(`${VITE_API_BASE_URL.replace('/v1', '')}/auth/address`, { // Adjust path
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
      setAuthUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));

      setIsAddressModal(false);
      toast.success("Address saved successfully!");
    
      // Removed direct handlePlaceOrder() call here.
      // The user will click 'Pay' in CartModal/Checkout after address is saved.
    } catch (error) {
   
      toast.error(error.message || "Failed to save address. Please try again.");
    }
  }, [user, setAuthUser]); // Removed handlePlaceOrder from dependencies as it's not called directly here

  // NEW FEATURE: Function to clear all of the current user's orders
  const handleClearMyOrders = useCallback(async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to clear your orders.");
      return;
    }

    const confirmClear = window.confirm("Are you sure you want to clear ALL your past orders? This action cannot be undone.");
    if (!confirmClear) {
      toast("Order clearing cancelled.", { icon: '✋' });
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Authentication token missing. Please log in again.");
        return;
      }

      // Use VITE_API_BASE_URL for consistency
      // Backend route for clearing orders is /api/orders/my
      const clearOrdersApiUrl = `${VITE_API_BASE_URL.replace('/v1', '')}/orders/my`; // Adjust path
   

      const res = await fetch(clearOrdersApiUrl, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to clear orders.");
      }

      toast.success("🗑️ All your past orders have been cleared!");
      clearCart();
    } catch (err) {
     
      toast.error(`Failed to clear orders: ${err.message}`);
    }
  }, [isAuthenticated, user, clearCart]);





  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<Success />} />

        {/* Conditional rendering for Login and Signup routes */}
        {isAuthenticated ? (
          <>
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}

        <Route path="/menu" element={<Menu />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <CartIcon onCartClick={() => setIsCartModalOpen(true)} />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        // Pass necessary props to CartModal for Checkout to use
        items={cartItems}
        totalAmount={cartTotal}
        address={user?.address}
        user={user}
      />

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModal(false)}
        onSaveAddress={saveAddress}
        initialAddress={user?.address}
      />
<Footer />

    
    </>
  );
};
