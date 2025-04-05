// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider  from './contexts/AuthContext';
import  PrivateRoute  from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';


// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Room pages
import RoomList from './pages/Rooms/RoomList';
import RoomDetails from './pages/Rooms/RoomDetails';

// Booking pages
import  MyBookings  from './pages/Bookings/MyBookings';
import  AllBookings from './pages/Bookings/AllBookings';
import  NewBooking from './pages/Bookings/NewBooking';
import  EditBooking  from './pages/Bookings/EditBooking';
// Admin pages
import UserManagement from './pages/Admin/UserManagement';

import Home from './pages/Home';
// Home page component
// const Home = () => {
//   return (
//     <div className="container mt-4">
//       <div className="jumbotron">
//         <h1 className="display-4">Welcome to Meeting Room Booking System</h1>
//         <p className="lead">
//           Book meeting rooms, manage your bookings, and find available spaces all in one place.
//         </p>
//         <hr className="my-4" />
//         <p>
//           Get started by browsing available rooms or checking your upcoming bookings.
//         </p>
//         <div className="mt-4">
//           <a className="btn btn-primary btn-lg me-2" href="/rooms" role="button">Browse Rooms</a>
//           <a className="btn btn-success btn-lg" href="/bookings/my" role="button">My Bookings</a>
//         </div>
//       </div>
//     </div>
//   );
// };

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="pb-5">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Room routes */}
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            
            {/* Protected routes (require login) */}
            <Route element={<PrivateRoute />}>
              <Route path="/bookings/my" element={<MyBookings />} />
              <Route path="/bookings/new" element={<NewBooking />} />
              <Route path="/bookings/edit/:id" element={<EditBooking />} />
            </Route>
            
            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/bookings/all" element={<AllBookings />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-light py-3 text-center mt-auto">
          <div className="container">
            <span className="text-muted">
              Meeting Room Booking System &copy; {new Date().getFullYear()}
            </span>
          </div>
        </footer>
      </Router>
    </AuthProvider>
  );
};

export default App;