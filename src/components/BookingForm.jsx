// src/components/BookingForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import roomService from '../api/roomService';
import bookingService from '../api/bookingService';

const BookingForm = ({ bookingId = null, initialData = null }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    attendees: ''
  });
  
  const navigate = useNavigate();
  const isEditMode = !!bookingId;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load list of rooms
        const roomsData = await roomService.getAllRooms();
        setRooms(roomsData);
        
        // If in edit mode, load booking data
        if (isEditMode && !initialData) {
          const bookingData = await bookingService.getBookingById(bookingId);
          
          // Format dates for input fields
          const formattedBooking = {
            ...bookingData,
            startTime: new Date(bookingData.startTime).toISOString().slice(0, 16),
            endTime: new Date(bookingData.endTime).toISOString().slice(0, 16),
            attendees: Array.isArray(bookingData.attendees) 
              ? bookingData.attendees.join(', ') 
              : typeof bookingData.attendees === 'string'
                ? bookingData.attendees
                : ''
          };
          
          setFormData(formattedBooking);
        } else if (initialData) {
          // Check if attendees is already a string or an array before processing
          const attendeesValue = Array.isArray(initialData.attendees)
            ? initialData.attendees.join(', ')
            : typeof initialData.attendees === 'string'
              ? initialData.attendees
              : '';
              
          setFormData({
            ...initialData,
            startTime: initialData.startTime ? new Date(initialData.startTime).toISOString().slice(0, 16) : '',
            endTime: initialData.endTime ? new Date(initialData.endTime).toISOString().slice(0, 16) : '',
            attendees: attendeesValue
          });
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [bookingId, initialData, isEditMode]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSubmitting(true);
      
      // Prepare data for submission
      const bookingData = {
        ...formData,
        roomId: parseInt(formData.roomId),
        attendees: formData.attendees.split(',').map(attendee => attendee.trim()).filter(Boolean)
      };
      
      // Check if room is available (skip this check if we're editing the current booking)
      if (!isEditMode) {
        const isAvailable = await bookingService.isRoomAvailable(
          bookingData.roomId,
          bookingData.startTime,
          bookingData.endTime
        );
        
        if (!isAvailable) {
          setError('This room is not available for the selected time slot.');
          setSubmitting(false);
          return;
        }
      }
      
      if (isEditMode) {
        await bookingService.updateBooking(bookingId, bookingData);
      } else {
        await bookingService.createBooking(bookingData);
      }
      
      navigate('/bookings/my');
    } catch (err) {
      setError(err.response?.data || 'Failed to save booking. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title mb-4">{isEditMode ? 'Edit Booking' : 'New Booking'}</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="roomId" className="form-label">Meeting Room</label>
            <select
              id="roomId"
              name="roomId"
              className="form-select"
              value={formData.roomId}
              onChange={handleChange}
              required
              disabled={isEditMode} // Can't change room when editing
            >
              <option value="">Select a room</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} (Capacity: {room.capacity})
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Meeting Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="startTime" className="form-label">Start Time</label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                className="form-control"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="endTime" className="form-label">End Time</label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                className="form-control"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="attendees" className="form-label">Attendees (comma-separated)</label>
            <input
              type="text"
              id="attendees"
              name="attendees"
              className="form-control"
              value={formData.attendees}
              onChange={handleChange}
              placeholder="e.g. john@example.com, jane@example.com"
            />
          </div>
          
          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <button
              type="button"
              className="btn btn-secondary me-md-2"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (isEditMode ? 'Update Booking' : 'Create Booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;