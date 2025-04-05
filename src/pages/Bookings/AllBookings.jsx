// src/pages/Bookings/AllBookings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../../api/bookingService';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingService.getAllBookings();
        setBookings(data);
      } catch (err) {
        setError('Failed to load bookings. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBookings();
  }, []);

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

  const getBookingStatus = (booking) => {
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);
    const now = new Date();
    
    if (endTime < now) {
      return 'Completed';
    } else if (startTime < now && endTime > now) {
      return 'In Progress';
    } else {
      return 'Upcoming';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    
    const status = getBookingStatus(booking);
    return status.toLowerCase() === filterStatus.toLowerCase();
  });

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>All Bookings</h1>
        <Link to="/bookings/new" className="btn btn-primary">
          New Booking
        </Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <label htmlFor="statusFilter" className="me-2">Filter by status:</label>
            <select
              id="statusFilter"
              className="form-select form-select-sm w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="alert alert-info">No bookings found.</div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead>
                  <tr>
                    
                    <th>Title</th>
                    <th>Booked By</th>
                    {/* <th>Start Time</th>
                    <th>End Time</th> */}
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => {
                    const status = getBookingStatus(booking);
                    
                    return (
                      <tr key={booking.id}>
                       
                        <td>{booking.title}</td>
                        <td>{booking.bookedByUserName}</td>
                        <td>
                        {new Date().toLocaleDateString('en-US', {
                                                                  weekday: 'long',
                                                                  year: 'numeric',
                                                                  month: 'long',
                                                                  day: 'numeric'
                                                                  })}
                        </td>
                        <td>
                            {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} 
                            - 
                            {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , hour12:false})}</td>
                        {/* <td>{new Date(booking.startTime).toLocaleString()}</td>
                        <td>{new Date(booking.endTime).toLocaleString()}</td> */}
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
                              <Link className='me-2'
                                to={`/bookings/edit/${booking.id}`} 
                                
                              >
                                Edit
                              </Link>
                              <Link style={{color:'red'}}
                                  to="#" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(booking.id);
                                  }}
                                  
                                  >
                              Cancel
                              </Link>
                            </>
                          )}
                        </td>


                        {/* <td>
                            {status === 'Upcoming' && (
                              <>
                                <Link 
                                  to={`/bookings/edit/${booking.id}`}
                                >
                                  Edit
                                </Link>
                                <Link 
                                  to="#" 
                                  className="text-danger"
                                  onClick={() => handleCancel(booking.id)}
                                >
                                  Cancel
                                </Link>
                              </>
                            )}
                        </td> */}


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

export default AllBookings;