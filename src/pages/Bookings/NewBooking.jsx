// src/pages/Bookings/NewBooking.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BookingForm from '../../components/BookingForm';
import roomService from '../../api/roomService';

const NewBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get('roomId');
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!roomId);
  const [error, setError] = useState(null);

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
          setError(null);
        } catch (err) {
          console.error('Failed to load room data:', err);
          setError('Unable to load room information. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadInitialData();
  }, [roomId]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container px-3 px-sm-4 py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="d-flex align-items-center mb-4">
            <button 
              onClick={handleBack}
              className="btn btn-sm btn-outline-secondary me-3"
              aria-label="Go back"
            >Back
              <i className="bi bi-arrow-left"></i>
            </button>
            {/* <h2 className="mb-0">New Booking</h2> */}
          </div>

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading room information...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
              <div className="mt-3">
                <button 
                  className="btn btn-outline-danger me-2"
                  onClick={handleBack}
                >
                  Go Back
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            //<div className="card shadow-sm">
               <div className="">
              <div className=" p-3 p-md-4">
                <BookingForm initialData={initialData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewBooking;