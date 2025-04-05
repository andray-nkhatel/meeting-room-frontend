// src/pages/Rooms/RoomDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import roomService from '../../api/roomService';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const loadRoomDetails = async () => {
      try {
        setLoading(true);
        
        // Load room details
        const roomData = await roomService.getRoomById(parseInt(id));
        setRoom(roomData);
        
        // Load room availability for current date
        const availabilityData = await roomService.getRoomAvailability(parseInt(id), date);
        setAvailability(availabilityData);
        
        setError('');
      } catch (err) {
        setError('Failed to load room details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadRoomDetails();
  }, [id, date]);

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    
    try {
      setLoading(true);
      const availabilityData = await roomService.getRoomAvailability(parseInt(id), newDate);
      setAvailability(availabilityData);
      setError('');
    } catch (err) {
      setError('Failed to load room availability. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !room) {
    return <div className="text-center my-5">Loading...</div>;
  }

  if (error && !room) {
    return <div className="alert alert-danger my-5">{error}</div>;
  }

  if (!room) {
    return <div className="alert alert-warning my-5">Room not found</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <h1 className="card-title h4">{room.name}</h1>
              <h6 className="card-subtitle mb-3 text-muted">Capacity: {room.capacity} people</h6>
              
              <p className="card-text">{room.description || 'No description available.'}</p>
              
              <h6 className="mt-4 mb-2">Features</h6>
              <ul className="list-group list-group-flush mb-3">
                {room.features && room.features.length > 0 ? (
                  room.features.map((feature, index) => (
                    <li key={index} className="list-group-item">{feature}</li>
                  ))
                ) : (
                  <li className="list-group-item">No special features</li>
                )}
              </ul>
              
              <Link to={`/bookings/new?roomId=${room.id}`} className="btn btn-primary w-100">
                Book This Room
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Room Availability</h2>
              
              <div className="d-flex align-items-center">
                <label htmlFor="date" className="me-2">Date:</label>
                <input
                  type="date"
                  id="date"
                  className="form-control form-control-sm"
                  value={date}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            
            <div className="card-body">
              {loading && availability ? (
                <div className="text-center my-3">Loading availability data...</div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : !availability ? (
                <div className="alert alert-info">No availability data found for this date.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Booking</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availability.timeSlots.map((slot, index) => (
                        <tr key={index}>
                          <td>
                            {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} 
                            - 
                            {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </td>
                          <td>
                            <span className={`badge ${slot.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                              {slot.isAvailable ? 'Available' : 'Booked'}
                            </span>
                          </td>
                          <td>
                          {!slot.isAvailable && slot.booking?.title ? slot.booking.title : '-'}
                            {/* {!slot.isAvailable && slot.bookingTitle ? slot.booking : '-'} */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;