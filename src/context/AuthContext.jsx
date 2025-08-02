import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Local Firebase config for development
import localFirebaseConfig from '../firebaseConfig'; 

// Base URL for backend authentication API, using environment variable
// FIX: Appended '/auth' to BASE_URL to correctly match backend routing.
const BASE_URL = import.meta.env.VITE_API_URL + '/auth'; 

// Auth Context creation
const AuthContext = createContext(null);

// Custom hook to access Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Authentication context provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);
  const [firebaseAuthInstance, setFirebaseAuthInstance] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  // Sets authentication data in local storage and state
  const setAuthData = (token, userData) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setUserId(userData._id || userData.email);
    setIsAuthenticated(true);
  };

  // Clears authentication data
  const clearAuthData = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    setUser(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  // Checks authentication status from local storage on load
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('jwtToken');
    const storedUserData = localStorage.getItem('userData');

    if (token && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUser(userData);
        setUserId(userData._id || userData.email);
        setIsAuthenticated(true);
      } catch (error) {
        clearAuthData();
      }
    } else {
      clearAuthData();
    }
    setLoading(false);
  }, []);

  // Initializes Firebase SDK and checks auth status
  useEffect(() => {
    const initializeFirebaseSDK = () => {
      try {
        // Use Canvas environment config if available, otherwise local config
        const firebaseConfig = typeof __firebase_config !== 'undefined' && Object.keys(JSON.parse(__firebase_config)).length > 0
          ? JSON.parse(__firebase_config)
          : localFirebaseConfig; 

        if (!Object.keys(firebaseConfig).length || !firebaseConfig.apiKey) {
          setFirebaseReady(true);
          return;
        }
        const app = initializeApp(firebaseConfig);
        setDb(getFirestore(app));
        setFirebaseAuthInstance(getAuth(app));
        setFirebaseReady(true);

        onAuthStateChanged(getAuth(app), (fbUser) => {
          // Firebase client-side auth state change listener (no action needed here for this context)
        });

      } catch (error) {
        toast.error("Failed to initialize Firebase services for Google Sign-In.");
        setFirebaseReady(true);
        setLoading(false);
      }
    };

    initializeFirebaseSDK();
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Handles user signup with backend
  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      toast.success(data.message || "Account created successfully!");
      navigate('/login');
      return true;
    } catch (error) {
      toast.error(`Sign up failed: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handles user login with backend
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setAuthData(data.token, data.user);
      toast.success(data.message || "Logged in successfully!");
      navigate('/dashboard');
      return true;
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handles user logout
  const logout = async () => {
    try {
      setLoading(true);
      clearAuthData();
      toast.success("Logged out successfully!");
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handles Google Sign-In integration with backend
  const googleSignInBackend = async (firebaseUser) => {
    try {
      setLoading(true);
      const idToken = await firebaseUser.getIdToken();

      const response = await fetch(`${BASE_URL}/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Google sign-in with backend failed');
      }

      setAuthData(data.token, data.user);
      toast.success(data.message || "Google sign-in successful!");
      navigate('/dashboard');
      return true;
    } catch (error) {
      if (error.message?.includes("popup")) {
        toast('Google Sign-In popup closed.', { icon: '👋' });
      } else {
        toast.error(error.message || "Google Sign-In failed. Please try again.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Context value provided to consumers
  const contextValue = {
    user,
    userId,
    loading,
    db,
    firebaseAuthInstance,
    firebaseReady,
    isAuthenticated,
    signup,
    login,
    logout,
    googleSignInBackend,
    setAuthUser: setUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading || !firebaseReady ? (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-blue-600 text-lg">Loading authentication services...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
