// src/components/BookingModal.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from './Button';
import { FaTimes } from 'react-icons/fa';

const BookingModal = ({ isOpen, onClose, service, salonId, onBookingConfirmed }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !service) return null;

  const handleSubmit = async () => {
    if (!date || !time) {
      return toast.error("Please select a date and time.");
    }
    
    setLoading(true);
    // Combine date and time to create ISO strings for the backend.
    // NOTE: This is a simplified approach. A real app would use a proper date-time picker library.
    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + service.duration * 60000); // Add duration in milliseconds

    const bookingData = {
      salonId,
      serviceName: service.name,
      servicePrice: service.price,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    // Pass the final data up to the parent page to handle the API call
    await onBookingConfirmed(bookingData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FaTimes size={20} /></button>
        </div>
        
        <div className="border-t pt-4">
          <p className="font-semibold text-lg">{service.name}</p>
          <p className="text-text-muted">Duration: {service.duration} minutes</p>
          <p className="text-lg font-bold mt-2">Price: ₦{service.price.toLocaleString()}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Select Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Select Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="gradient" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Requesting...' : 'Request to Book'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;