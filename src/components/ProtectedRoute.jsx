import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  // Destructure authentication states from AuthContext
  const { isAuthenticated, loading, firebaseReady } = useAuth();
  const location = useLocation();

  // Show a loading state while authentication status is being determined and Firebase is ready
  if (loading || !firebaseReady) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-blue-600 text-lg">Loading authentication status...</p>
      </div>
    );
  }

  // If user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    // Pass current location in state to redirect back after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children (the protected component)
  return children;
};

export default ProtectedRoute;
