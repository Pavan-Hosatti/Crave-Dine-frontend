import React, { useState } from 'react'; // Corrected import syntax
import { Link, Navigate } from 'react-router-dom'; // Corrected import syntax
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Keep Firebase imports for Google Sign-In
import './Auth.css'; // Ensure your Auth.css is imported for styling

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { signup, isAuthenticated, googleSignInBackend, firebaseAuthInstance, loading, firebaseReady } = useAuth();

  // DEBUG: Log component render and current auth states


  // Redirect if already authenticated
  if (isAuthenticated) {

    return <Navigate to="/dashboard" replace />;
  }

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    await signup(username, email, password);
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    
    if (!firebaseAuthInstance) {
      toast.error("Google Sign-Up is not initialized. Please wait or refresh.");
     
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    try {
      const result = await signInWithPopup(firebaseAuthInstance, provider);
      const user = result.user; // This is the Firebase-authenticated user object
    
      await googleSignInBackend(user); // Send Firebase user to your backend
    
    } catch (error) {
    
      if (error.code === 'auth/popup-closed-by-user') {
        toast('Google Sign-Up popup closed.', { icon: '👋' });
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error('Google Sign-Up was cancelled.');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Google Sign-Up not enabled for this project or API key restrictions are preventing it.');
      } else {
        toast.error('Google Sign-Up failed. Try again.');
      }
    }
  };

  if (loading || !firebaseReady) {

    
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-blue-600 text-lg">Loading signup form...</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>

        <div className="oauth-pair">
          <button
            onClick={handleGoogleSignIn}
            className="oauth-btn google-btn"
            disabled={!firebaseAuthInstance}
          >
            <svg viewBox="0 0 48 48" width="20px" height="20px" style={{ display: 'block' }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.65-6.65C34.52 2.76 29.38 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C13.48 12.86 18.21 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24c0-1.57-.15-3.09-.4-4.57H24v9.18h12.46c-.65 3.19-2.48 5.95-5.09 7.82v6.23h8.01c4.66-4.52 7.35-11.13 7.35-19.16z"></path>
              <path fill="#FBBC05" d="M9.53 28.72c-.44-1.21-.67-2.49-.67-3.72s.23-2.51.67-3.72v-6.23H1.52C.56 18.01 0 20.97 0 24s.56 5.99 1.52 8.73l7.98-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.79l-8.01-6.23c-2.61 1.87-4.44 4.63-5.09 7.82H24c-5.79 0-10.52-3.36-12.48-8.03L2.56 34.78C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Sign up with Google
          </button>
          {/* Removed Microsoft button as it's not implemented */}
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Sign Up</button>
        </form>

        <p className="redirect-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
