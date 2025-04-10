// src/components/Navbar.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Add this to debug the current user state
  // useEffect(() => {
  //   console.log('Navbar currentUser:', currentUser);
  // }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine admin status
  const isUserAdmin = currentUser && currentUser.isAdmin;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Emerald</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li> */}
            
            {/* <li className="nav-item">
              <Link className="nav-link" to="/rooms">Rooms</Link>
            </li> */}
            
            {currentUser && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/bookings/new">New Booking</Link>
                </li>
                
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/bookings/my">Bookings</Link>
                </li> */}
              </>
            )}
            
            {isUserAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/bookings/all">Bookings</Link>
                </li>
                
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">User</Link>
                </li>
              </>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <span className="nav-link disabled">
                    Hello, {currentUser.fullName}
                  </span>
                </li>
                
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-link nav-link">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;