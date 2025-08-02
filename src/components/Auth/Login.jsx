import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';


import './Auth.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const { login, isAuthenticated, loading, firebaseReady } = useAuth();

 


  // Redirect if already authenticated
  if (isAuthenticated) {
   
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
   

    try {
      const success = await login(email, password);
      if (success) {
       
      } else {
       
      }
    } catch (error) {
     
    }
  };

  // Removed handleGoogleSignIn function as it's no longer needed

  // Display a loading message if AuthContext is still loading or Firebase is not ready
  if (loading || !firebaseReady) {
    console.log("DEBUG: Login.jsx - Returning loading message due to AuthContext loading or Firebase not ready.");
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-blue-600 text-lg">Loading login form...</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
      

        <div className="divider">
          <span></span>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>

        <p className="redirect-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
