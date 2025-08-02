import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Dashboard.css';

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Dashboard = () => {
  const { user, logout, isAuthenticated, setAuthUser } = useAuth();
  const navigate = useNavigate();

  // State to manage which tab is active (for both desktop and mobile)
  const [activeTab, setActiveTab] = useState('profile');

  // State to manage mobile view: if a specific tab is active in full-screen mode
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileActiveTab, setMobileActiveTab] = useState(null); // Stores the tab shown in full-screen mobile view

  const [loadingReservations, setLoadingReservations] = useState(true);
  const [reservations, setReservations] = useState([]);

  // Local state variables for updating profile, now synchronized with the context
  const [username, setUsername] = useState(user?.username || '');
  const [address, setAddress] = useState(user?.address || {});
  const [profilePic, setProfilePic] = useState(null); // Assuming this is managed elsewhere or will be implemented
  const [theme, setTheme] = useState('default'); // Assuming this is managed elsewhere or will be implemented

  const [showPasswordCard, setShowPasswordCard] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showEmailCard, setShowEmailCard] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || '');

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // === FIX: This useEffect hook synchronizes local state with AuthContext state ===
  // When the 'user' object from the context changes, this updates local state variables.
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setNewEmail(user.email || '');
      setAddress(user.address || {});
    }
  }, [user]);

  // Effect to handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const currentIsMobile = window.innerWidth <= 768;
      setIsMobile(currentIsMobile);
      if (!currentIsMobile && mobileActiveTab) {
        setMobileActiveTab(null);
      }
      if (currentIsMobile && !mobileActiveTab && activeTab) {
        // No action needed here, activeTab will remain for desktop
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileActiveTab, activeTab]);

  // Dark mode toggle effect
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem('darkMode')) || false;
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Fetch data based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchReservations = async () => {
    setLoadingReservations(true);
    const token = localStorage.getItem('jwtToken');
    try {
      // Correct path: /api/v1/reservation/my
      const res = await fetch(`${BASE_URL}/api/v1/reservation/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReservations(data.reservations || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingReservations(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const token = localStorage.getItem('jwtToken');
    try {
      // FIX: Corrected path to include /v1
      const res = await fetch(`${BASE_URL}/api/v1/orders/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(data.orders || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateUsername = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      // Correct path: /api/v1/auth/update-username
      const res = await fetch(`${BASE_URL}/api/v1/auth/update-username`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuthUser(data.user);
        localStorage.setItem('userData', JSON.stringify(data.user));
        toast.success('Username updated!');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateAddress = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      // Correct path: /api/v1/auth/address
      const res = await fetch(`${BASE_URL}/api/v1/auth/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuthUser(data.user);
        localStorage.setItem('userData', JSON.stringify(data.user));
        toast.success('Address updated!');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updatePassword = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      // Correct path: /api/v1/auth/change-password
      const res = await fetch(`${BASE_URL}/api/v1/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Password updated!');
      setCurrentPassword('');
      setNewPassword('');
      setShowPasswordCard(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateEmail = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      // Correct path: /api/v1/auth/update-email
      const res = await fetch(`${BASE_URL}/api/v1/auth/update-email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAuthUser(data.user);
      localStorage.setItem('userData', JSON.stringify(data.user));
      toast.success('Email updated!');
      setShowEmailCard(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    const token = localStorage.getItem('jwtToken');
    try {
      // Correct path: /api/v1/auth/delete-account
      const res = await fetch(`${BASE_URL}/api/v1/auth/delete-account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Account deleted");
      localStorage.clear();
      logout();
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleClearMyOrders = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to clear your orders.");
      return;
    }

    // Using toast.promise for a better user experience for confirmation
    toast.promise(
      new Promise(async (resolve, reject) => {
        // Simulate a confirmation step with a temporary toast
        const confirmToastId = toast.loading("Confirm to clear ALL your past orders. This action cannot be undone.", {
          duration: Infinity, // Keep open until user action
          id: 'confirmClearOrders',
          className: 'custom-confirm-toast',
          icon: '⚠️',
          style: {
            minWidth: '250px',
            padding: '15px',
          },
        });

        // Add action buttons to the toast
        const confirmAction = (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => {
                toast.dismiss(confirmToastId);
                resolve(true); // Resolve with true for confirmation
              }}
              style={{
                background: '#dc3545', // Red for confirm
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Confirm Clear
            </button>
            <button
              onClick={() => {
                toast.dismiss(confirmToastId);
                reject(new Error("Order clearing cancelled.")); // Reject for cancellation
              }}
              style={{
                background: '#6c757d', // Gray for cancel
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        );

        toast.custom((t) => (
          <div style={{ ...t.style, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {t.message}
            {confirmAction}
          </div>
        ), { id: confirmToastId, duration: Infinity });

        try {
          // Wait for user confirmation via the custom toast
          await new Promise((res, rej) => {
            // This promise is resolved/rejected by the onClick handlers of the custom toast buttons
            confirmAction.props.children[0].props.onClick = () => {
              toast.dismiss(confirmToastId);
              res();
            };
            confirmAction.props.children[1].props.onClick = () => {
              toast.dismiss(confirmToastId);
              rej(new Error("Order clearing cancelled."));
            };
          });

          const token = localStorage.getItem("jwtToken");
          if (!token) {
            reject(new Error("Authentication token missing. Please log in again."));
            return;
          }

          // Correct backend route for clearing orders
          const clearOrdersApiUrl = `${BASE_URL}/api/v1/orders/my`;

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

          resolve("🗑️ All your past orders have been cleared!");
          // FIX: Re-fetch orders after clearing to update the UI
          fetchOrders(); 
        } catch (err) {
          reject(err);
        }
      }),
      {
        loading: 'Waiting for confirmation...',
        success: (message) => message,
        error: (err) => err.message,
      },
      {
        style: {
          minWidth: '250px',
        },
      }
    );
  };

  // Function to handle tab clicks
  const handleTabClick = (tab) => {
    setActiveTab(tab); // Always set active tab
    if (isMobile) {
      setMobileActiveTab(tab); // Show full page content on mobile
    }
  };

  // Function to go back from mobile full-page view
  const handleGoBack = () => {
    setMobileActiveTab(null); // Hide full page content, show sidebar/grid menu
  };

  // Render content for the currently active tab
  const renderContent = (tab) => {
    switch (tab) {
      case 'reservations':
        return (
          <>
            <h2>📅 My Reservations</h2>
            {loadingReservations ? <p className="loader">Loading...</p> : (
              <div className="reservations-list">
                {reservations.length === 0 ? (
                  <p>No reservations yet.</p>
                ) : (
                  reservations.map((r, i) => (
                    <div key={i} className="reservation-card-no-box"> {/* Using existing card style */}
                      <h3>{r.firstName} {r.lastName}</h3>
                      <p><strong>Date:</strong> {r.date} at {r.time}</p>
                      <p><strong>Contact:</strong> {r.email} | {r.phone}</p>
                    </div>
                  ))
                  
                )}
              </div>
            )}
          </>
        );
      case 'orders':
        return (
          <div className="orders-section">
            <h2>🧾 My Orders</h2>
            {loadingOrders ? <p className="loader">Loading orders...</p> : (
              <>
                {orders.length === 0 ? (
                  <p>No orders placed yet.</p>
                ) : (
                  orders.map((order, i) => (
                    <div key={i} className="order-card">
                      <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                      <p><strong>Items:</strong></p>
                      <ul>
                        {order.items.map((item, idx) => (
                          <li key={idx}>{item.dishName} x {item.quantity} - ₹{item.price}</li>
                        ))}
                      </ul>
                      <p><strong>Delivery Address:</strong> {order.address?.houseName}, {order.address?.street}, {order.address?.city}</p>
                    </div>
                  ))
                )}
                {orders.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleClearMyOrders}
                      className="clear-orders-button"
                      title="Clear All My Past Orders"
                    >
                      Clear All Orders
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="profile-section">
            <h2>👤 My Profile</h2>
            <div className="profile-details">
              <div className="profile-item"><strong>Username:</strong> {user.username || 'N/A'}</div>
              <div className="profile-item"><strong>Email:</strong> {user.email || 'N/A'}</div>
              <div className="profile-item">
                <strong>Address:</strong>
                {user.address ? (
                  <div className="address-block">
                    <p>{user.address.houseName}, {user.address.street}</p>
                    <p>{user.address.city}, {user.address.state} - {user.address.zipCode}</p>
                    <p>{user.address.country || 'India'}</p>
                  </div>
                ) : <p>No address available.</p>}
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className={`settings-section ${isDarkMode ? 'dark' : ''}`}>
            <h2>⚙️ Settings</h2> {/* Added heading for settings page */}
            <div className="settings-layout">
              <div className="settings-left">
                <label htmlFor="profilePicUpload">
                  <img
                    src={profilePic || '/avatar.png'}
                    alt="User Avatar"
                    className="profile-avatar clickable"
                  />
                </label>
                <input
                  type="file"
                  id="profilePicUpload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setProfilePic(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />

                <h2><span>Update Profile</span> </h2>

                <div className="theme-switch">
                  <label className="switch">
                    <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
                    <span className="slider round"></span>
                  </label>
                  <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </div>

                <div className="theme-select">
                  <label>Theme:</label>
                  <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="default">Default</option>
                    <option value="sky">Sky</option>
                    <option value="night">Night</option>
                  </select>
                </div>

                <button className="delete-account-btn" onClick={deleteAccount}>
                  🗑 Delete Account
                </button>
              </div>

              <div className={`settings-card ${activeTab === 'settings' ? 'dark' : ''}`}>
                <div className="settings-card dark ">
                  <button className="card-toggle">Update Username ⌄</button>
                  <div className="card-body">
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="New username" />
                    <button className="action-btn" onClick={updateUsername}>Save</button>
                  </div>
                </div>

                <div className="settings-card dark">
                  <button className="card-toggle" onClick={() => setShowPasswordCard(!showPasswordCard)}>
                    Change Password {showPasswordCard ? '⌄' : '＋'}
                  </button>
                  {showPasswordCard && (
                    <div className="card-body">
                      <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                      <button className="action-btn" onClick={updatePassword}>Save</button>
                    </div>
                  )}
                </div>

                <div className="settings-card dark">
                  <button className="card-toggle" onClick={() => setShowEmailCard(!showEmailCard)}>
                    Update Email {showEmailCard ? '⌄' : '＋'}
                  </button>
                  {showEmailCard && (
                    <div className="card-body">
                      <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                      <button className="action-btn" onClick={updateEmail}>Update Email</button>
                    </div>
                  )}
                </div>

                <div className="settings-card dark">
                  <button className="card-toggle">Update Address ＋</button>
                  <div className="card-body">
                    <input placeholder="House Name" value={address.houseName || ''} onChange={(e) => setAddress({ ...address, houseName: e.target.value })} />
                    <input placeholder="Street" value={address.street || ''} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                    <input placeholder="City" value={address.city || ''} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                    <input placeholder="State" value={address.state || ''} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                    <input placeholder="Zip" value={address.zipCode || ''} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} />
                    <input placeholder="Country" value={address.country || ''} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                    <button className="action-btn" onClick={updateAddress}>Save Address</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      {isMobile ? (
        mobileActiveTab ? (
          <div className="mobile-full-page-wrapper">
            <div className="mobile-header">
              <button
                onClick={handleGoBack}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: isDarkMode ? '#90cdf4' : '#007bff',
                  cursor: 'pointer',
                  padding: '14px 12px',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                  marginRight: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(66, 153, 225, 0.15)' : 'rgba(0, 123, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                ← Back
              </button>
            </div>
            <div className="mobile-full-page-content dashboard-main">
              {renderContent(mobileActiveTab)}
            </div>
          </div>
        ) : (
          <>
            <div className="mobile-dashboard-menu">
              {['reservations', 'orders', 'profile', 'settings'].map(tab => (
                <div
                  key={tab}
                  className={`cloud-tab ${activeTab === tab ? 'active-cloud' : ''}`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab === 'reservations' && (
                    <>
                      <span className="cloud-tab-icon">📅</span>
                      <h2 className="cloud-tab-title">
                        My Reservations
                        <br />
                        <span className="cloud-tab-description-inline">Your next delightful dining experience awaits!</span>
                      </h2>
                    </>
                  )}

                  {tab === 'orders' && (
                    <>
                      <span className="cloud-tab-icon">🧾</span>
                      <h2 className="cloud-tab-title">
                        My Orders
                        <br />
                        <span className="cloud-tab-description-inline">Track your delicious meals, every step of the way.</span>
                      </h2>
                    </>
                  )}

                  {tab === 'profile' && (
                    <>
                      <span className="cloud-tab-icon">👤</span>
                      <h2 className="cloud-tab-title">
                        Profile
                        <br />
                        <span className="cloud-tab-description-inline">Personalize your Crave & Dine experience.</span>
                      </h2>
                    </>
                  )}

                  {tab === 'settings' && (
                    <>
                      <span className="cloud-tab-icon">⚙️</span>
                      <h2 className="cloud-tab-title">
                        Settings
                        <br />
                        <span className="cloud-tab-description-inline">Customize your app, just the way you like it.</span>
                      </h2>
                    </>
                  )}
                </div>
              ))}
              <button className="cloud-logout-btn" onClick={logout}>🚪 Logout</button>
            </div>
          </>
        )
      ) : (
        <>
          <aside className="dashboard-sidebar">
            <h2>👋 Hi, {user.username || user.email}</h2>
            <ul>
              {['reservations', 'orders', 'profile', 'settings'].map(tab => (
                <li
                  key={tab}
                  className={activeTab === tab ? 'active' : ''}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'reservations' && '📅 My Reservations'}
                  {tab === 'orders' && '🧾 My Orders'}
                  {tab === 'profile' && '👤 Profile'}
                  {tab === 'settings' && '⚙️ Settings'}
                </li>
              ))}
            </ul>
            <div className="logout-button" style={{ marginTop: 'auto' }} onClick={logout}>
              <button className="delete-account-btn logout-btn-no-box">🚪 Logout</button>
            </div>
          </aside>

          <main className="dashboard-main">
            {renderContent(activeTab)}
          </main>
        </>
      )}
    </div>
  );
};

export default Dashboard;