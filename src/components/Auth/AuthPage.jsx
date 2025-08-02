import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext'; 
import './Auth.css'; 

const AuthPage = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();

 
  const { signup, login, googleSignInBackend, isAuthenticated, loading, firebaseReady } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '', 
    password: '',
    confirmPassword: '' 
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      await signup(formData.username, formData.email, formData.password);
    } else { 
      await login(formData.email, formData.password);
    }
  };

  const handleGoogleSignIn = async () => {

    await googleSignInBackend();
  };

  
  if (loading || !firebaseReady) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-blue-600 text-lg">Loading authentication form...</p>
      </div>
    );
  }

  return (
    <div className="auth-container"> 
      <div className="auth-card"> 
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          {mode === 'login' ? 'Login to your account' : 'Create a new account'}
        </h2>

        <div className="oauth-pair">
          <button type="button" className="oauth-btn google-btn" onClick={handleGoogleSignIn}>
            <svg viewBox="0 0 48 48" width="20px" height="20px">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.65-6.65C34.52 2.76 29.38 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C13.48 12.86 18.21 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24c0-1.57-.15-3.09-.4-4.57H24v9.18h12.46c-.65 3.19-2.48 5.95-5.09 7.82v6.23h8.01c4.66-4.52 7.35-11.13 7.35-19.16z"/>
              <path fill="#FBBC05" d="M9.53 28.72c-.44-1.21-.67-2.49-.67-3.72s.23-2.51.67-3.72v-6.23H1.52C.56 18.01 0 20.97 0 24s.56 5.99 1.52 8.73l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.79l-8.01-6.23c-2.61 1.87-4.44 4.63-5.09 7.82H24c-5.79 0-10.52-3.36-12.48-8.03L2.56 34.78C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Google
          </button>
          <button type="button" className="oauth-btn microsoft-btn">
            <img src="https://img.icons8.com/color/24/microsoft.png" alt="microsoft" />
            Microsoft
          </button>
        </div>

        <div className="divider">or continue with email</div> 

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group"> 
            <label htmlFor="email">Email:</label>
            <input
              type="email" 
              name="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group"> 
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>

          <p className="redirect-text">
            {mode === 'login' ? (
              <>Don't have an account? <Link to="/signup">Sign up</Link></>
            ) : (
              <>Already have an account? <Link to="/login">Login</Link></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
