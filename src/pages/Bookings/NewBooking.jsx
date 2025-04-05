// src/pages/Bookings/NewBooking.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookingForm from '../../components/BookingForm';
import roomService from '../../api/roomService';

const NewBooking = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!roomId);

  useEffect(() => {
    const loadInitialData = async () => {
      if (roomId) {
        try {
          const roomData = await roomService.getRoomById(parseInt(roomId));
          
          // Set initial form data with room pre-selected
          setInitialData({
            roomId: roomData.id,
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            attendees: ''
          });
        } catch (err) {
          console.error('Failed to load room data:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadInitialData();
  }, [roomId]);

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      {/* <h1 className="mb-4">New Booking</h1> */}
      <BookingForm initialData={initialData} />
    </div>
  );
};


export default NewBooking;