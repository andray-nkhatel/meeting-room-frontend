// src/pages/Bookings/MyBookings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import bookingService from '../../api/bookingService';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingService.getAllBookings();
        
        // Filter bookings for the current user
        const userBookings = data.filter(booking => 
          booking.createdBy === currentUser.id || booking.createdByName === currentUser.username
        );
        
        setBookings(userBookings);
      } catch (err) {
        setError('Failed to load bookings. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBookings();
  }, [currentUser]);

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.deleteBooking(bookingId);
        setBookings(bookings.filter(booking => booking.id !== bookingId));
      } catch (err) {
        setError('Failed to cancel booking. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Bookings</h1>
        <Link to="/bookings/new" className="btn btn-primary">
          New Booking
        </Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {bookings.length === 0 ? (
        <div className="alert alert-info">You don't have any bookings yet.</div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Title</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => {
                    const startTime = new Date(booking.startTime);
                    const endTime = new Date(booking.endTime);
                    const now = new Date();
                    let status = 'Upcoming';
                    
                    if (endTime < now) {
                      status = 'Completed';
                    } else if (startTime < now && endTime > now) {
                      status = 'In Progress';
                    }
                    
                    return (
                      <tr key={booking.id}>
                        <td>{booking.roomName}</td>
                        <td>{booking.title}</td>
                        <td>{startTime.toLocaleString()}</td>
                        <td>{endTime.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${
                            status === 'Upcoming' ? 'bg-warning' :
                            status === 'In Progress' ? 'bg-primary' : 'bg-secondary'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td>
                          {status === 'Upcoming' && (
                            <>
                              <Link 
                                to={`/bookings/edit/${booking.id}`} 
                                className="btn btn-sm btn-outline-primary me-2"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(booking.id)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;