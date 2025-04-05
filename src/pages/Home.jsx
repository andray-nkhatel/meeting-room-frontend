// src/pages/Home.jsx
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
        <div className="col-lg-8">
          <div className="jumbotron">
            <h1 className="display-4">Welcome to Emerald!</h1>
            <p className="lead">
              Schedule meetings, manage your schedules, and find available spaces all in one place.
            </p>
            <hr className="my-4" />
            <p>
              Get started by browsing available rooms or checking your upcoming meetings.
            </p>
            <div className="mt-4">
              <Link className="btn btn-primary btn-lg me-2" to="/rooms">Browse Rooms</Link>
              {/* {currentUser && (
                <Link className="btn btn-success btn-lg" to="/bookings/my">My Bookings</Link>
              )} */}
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Today's Meetings</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Loading today's meetings...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : todaysMeetings.length === 0 ? (
                <p>No meetings scheduled for today.</p>
              ) : (
                <div className="list-group">
                  {todaysMeetings.map(meeting => (
                    <div key={meeting.id} className="list-group-item list-group-item-action mb-2 ">
                      <div className="d-flex w-100 justify-content-between">
                        {/* <sub className='mb-1'><b>{meeting.title}</b></sub>
                        <sub>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</sub> */}

                       <small style={{ fontSize: '0.7rem' }} className="text-muted mb-1">
                        
                          <b title={meeting.title}>
                          {meeting.title.length > 30 ? meeting.title.substring(0, 30) + '...' : meeting.title}
                          </b>
                      </small>

                        <small style={{ fontSize: '0.7rem' }}>{formatTime(meeting.startTime)} hrs</small>
                      </div>
                      {/* <p className="mb-1 small">{meeting.roomName}</p> 
                      <small>Booked by: {meeting.bookedByUserName}</small> */}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card-footer">
              <Link to="/rooms" className="btn btn-outline-primary btn-sm">Book a Room</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;