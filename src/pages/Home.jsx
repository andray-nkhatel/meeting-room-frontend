import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../api/bookingService';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [todaysMeetings, setTodaysMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchTodaysMeetings = async () => {
      try {
        const meetings = await bookingService.getTodaysMeetings();
        setTodaysMeetings(meetings);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch today\'s meetings', err);
        setError('Failed to load today\'s meetings');
        setLoading(false);
      }
    };
    
    fetchTodaysMeetings();
  }, []);
  
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false
    });
  };
  
  return (
    <div className="container mt-4">
      <div className="row">
        {/* Main content - full width on mobile, 8 columns on large screens */}
        <div className="col-12 col-lg-8 mb-4">
          <div className="jumbotron p-4 bg-light rounded">
            <h1 className="display-5 display-md-4">Welcome to Emerald!</h1>
            <p className="lead">
              Schedule meetings, manage your schedules, and find available spaces all in one place.
            </p>
            <hr className="my-4" />
            <p>
              Get started by browsing available rooms or checking your upcoming meetings.
            </p>
            <div className="mt-4 d-flex flex-wrap gap-2">
              <Link className="btn btn-primary btn-lg" to="/rooms">Browse Rooms</Link>
              {currentUser && (
                <Link className="btn btn-success btn-lg" to="/bookings/my">My Bookings</Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Today's Meetings - full width on mobile, 4 columns on large screens */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Today's Meetings</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading today's meetings...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  <p className="mb-0">{error}</p>
                </div>
              ) : todaysMeetings.length === 0 ? (
                <p className="text-center py-3">No meetings scheduled for today.</p>
              ) : (
                <div className="list-group">
                  {todaysMeetings.map(meeting => (
                    <div key={meeting.id} className="list-group-item list-group-item-action mb-2">
                      <div className="d-flex flex-column w-100">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold" style={{ wordBreak: 'break-word' }}>
                            {meeting.title}
                          </span>
                          <small className="text-nowrap ms-2">{formatTime(meeting.startTime)} hrs</small>
                        </div>
                        <small className="text-muted">{meeting.roomName}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
              <Link to="/rooms" className="btn btn-primary">Book a Room</Link>
              {currentUser && (
                <Link to="/bookings/my" className="btn btn-outline-secondary">My Bookings</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;