// src/pages/Rooms/RoomList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import roomService from '../../api/roomService';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startTime: '',
    endTime: '',
    capacity: ''
  });

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await roomService.getAllRooms();
        setRooms(data);
      } catch (err) {
        setError('Failed to load rooms. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadRooms();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // Only search for available rooms if all filter fields are filled
      if (filters.startTime && filters.endTime) {
        const availableRooms = await roomService.getAvailableRooms(
          filters.startTime,
          filters.endTime,
          filters.capacity ? parseInt(filters.capacity) : null
        );
        setRooms(availableRooms);
      } else {
        // If not all fields are filled, load all rooms
        const allRooms = await roomService.getAllRooms();
        setRooms(allRooms);
      }
    } catch (err) {
      setError('Failed to search for rooms. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setFilters({
      startTime: '',
      endTime: '',
      capacity: ''
    });
    
    setLoading(true);
    
    try {
      const data = await roomService.getAllRooms();
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Meeting Rooms</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      

      
      {rooms.length === 0 ? (
        <div className="alert alert-info">No meeting rooms found matching your criteria.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {rooms.map(room => (
            <div key={room.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{room.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Capacity: {room.capacity} people</h6>
                  <p className="card-text">
                    {room.description || 'No description available.'}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Features: {room.features?.join(', ') || 'None'}
                    </small>
                  </p>
                </div>
                <div className="card-footer">
                  <Link to={`/rooms/${room.id}`} className="btn btn-primary btn-sm me-2">
                    View Details
                  </Link>
                  <Link to={`/bookings/new?roomId=${room.id}`} className="btn btn-success btn-sm">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;