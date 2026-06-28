import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/Volt_Logo.png'; 
import SearchBar from './SearchBar';
import '../styles/Navbar.css';

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', avatar: '' });
  const [theme, setTheme] = useState('light');
  
  const [userX, setUserX] = useState(0);
  const [userY, setUserY] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    setIsLoggedIn(!!token);

    if (token && userString) {
        try {
            const user = JSON.parse(userString);
            const getAvatarUrl = (profilePic) => {
                if (!profilePic) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
                if (profilePic.startsWith('data:') || profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
                    return profilePic;
                }
                return `http://localhost:5000/uploads/${profilePic}`;
            };
            setUserData({
                name: user.displayName || user.username || 'User',
                avatar: getAvatarUrl(user.profilePic)
            });
            if (user.x !== undefined && user.y !== undefined) {
                setUserX(user.x);
                setUserY(user.y);
            }
        } catch (e) {
            console.error("Error parsing user data in Navbar:", e);
        }
    }
  }, [location]);

  useEffect(() => {
      if (theme === 'dark') {
          document.body.classList.add('bg-dark', 'text-light', 'dark-theme');
          document.body.classList.remove('bg-light', 'text-dark', 'light-theme');
      } else {
          document.body.classList.add('bg-light', 'text-dark', 'light-theme');
          document.body.classList.remove('bg-dark', 'text-light', 'dark-theme');
      }
  }, [theme]);

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      navigate('/login');
  };

  const toggleTheme = () => {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const isSearchVisible = isLoggedIn && (location.pathname === '/restaurants' || location.pathname.includes('/restaurant/'));
  const isInsideRestaurant = location.pathname.includes('/restaurant/');
  const currentPlaceholder = isInsideRestaurant 
      ? "Search for dishes or drinks..." 
      : "Looking for a specific restaurant/food type?";

  return (
    <nav className={`navbar ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link className="navbar-logo-link" to="/">
            <img src={logo} alt="Volt Logo" className="navbar-logo-img" />
          </Link>

          {isLoggedIn && (
            <div className="navbar-address-delivery">
              <span className="address-icon">📍</span>
              <div className="address-text">
                <span className="address-label">Location Coordinates:</span>
                <span className="address-value">X: {userX}, Y: {userY}</span>
              </div>
            </div>
          )}
        </div>

        {isSearchVisible && (
          <div className="navbar-search-section">
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder={currentPlaceholder} 
            />
          </div>
        )}

        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <Link className="nav-btn" to="/restaurants">Restaurants</Link>
              <Link className="nav-btn nav-btn-cart" to="/orders">🛒 Cart</Link>
              <Link className="nav-btn" to="/historyOrders">History</Link>
              
              <div className="navbar-user-info">
                <img src={userData.avatar} alt="Avatar" className="navbar-avatar" />
                <span className="navbar-username">{userData.name}</span>
              </div>

              <button className="nav-theme-toggle-btn" onClick={toggleTheme}>
                  {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>

              <button className="nav-btn nav-btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-btn nav-btn-login" to="/login">Login</Link>
              <Link className="nav-btn nav-btn-signup" to="/register">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;