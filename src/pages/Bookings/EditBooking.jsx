// src/pages/Bookings/EditBooking.js
import React from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../../components/BookingForm';

const EditBooking = () => {
  const { id } = useParams();

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Edit Booking</h1>
      <BookingForm bookingId={id} />
    </div>
  );
};

export default EditBooking;
