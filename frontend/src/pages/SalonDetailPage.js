// src/pages/SalonDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSalonById, createAppointment } from '../api';
import { toast } from 'react-toastify';
import { FaSpinner, FaStar } from 'react-icons/fa';
import Button from '../components/Button';
import BookingModal from '../components/BookingModal'; // <-- Import the new modal

const SalonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW: State for managing the booking modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const getSalon = async () => {
      try {
        setLoading(true);
        const { data } = await fetchSalonById(id);
        setSalon(data);
      } catch (err) {
        setError("Could not load salon details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getSalon();
  }, [id]);

  // --- NEW: Function to open the modal with the selected service ---
  const handleBookClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // --- NEW: Function to handle the final booking submission ---
  const handleConfirmBooking = async (bookingData) => {
    try {
      await createAppointment(bookingData);
      toast.success('Appointment requested successfully! The salon will confirm shortly.');
      setIsModalOpen(false); // Close the modal on success
      navigate('/dashboard'); // Redirect user to their dashboard
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-5xl text-primary-purple" /></div>;
  if (error) return <div className="container mx-auto p-8 text-center text-red-500">{error}</div>;
  if (!salon) return <div className="container mx-auto p-8 text-center">Salon not found.</div>;

  const displayImage = salon.photos && salon.photos.length > 0
    ? salon.photos[0]
    : 'https://via.placeholder.com/1200x400.png?text=BeautyHub';

  return (
    <>
      <div className="bg-gray-50">
        {/* Header Section with Image */}
        <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${displayImage})` }}></div>
        <div className="container mx-auto p-8 -mt-20">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-text-main">{salon.name}</h1>
            <p className="text-lg text-text-muted mt-2">{salon.city}, {salon.address}</p>
            <div className="flex items-center space-x-2 mt-2">
              <FaStar className="text-yellow-400" />
              <span className="font-bold">{salon.averageRating?.toFixed(1) || 'New'}</span>
              <span className="text-text-muted">({salon.reviews?.length || 0} reviews)</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Services) */}
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Services</h2>
                <ul className="mt-4 space-y-4">
                    {(salon.services && salon.services.length > 0) ? salon.services.map(service => (
                        <li key={service._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                            <div>
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                <p className="text-sm text-text-muted max-w-md">{service.description}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                                <span className="font-bold text-lg">₦{service.price.toLocaleString()}</span>
                                {/* --- THIS BUTTON NOW WORKS --- */}
                                <Button variant="gradient" className="!py-2 !px-4" onClick={() => handleBookClick(service)}>
                                  Book
                                </Button>
                            </div>
                        </li>
                    )) : (
                      <p className="text-text-muted">No services listed for this salon yet.</p>
                    )}
                </ul>
            </div>

            {/* Right Column (Info) - can be expanded later */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Information</h2>
                <div className="mt-4 space-y-2">
                    <p><strong>Phone:</strong> {salon.phone}</p>
                    {/* Add opening hours, map, etc. here */}
                </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* The Booking Modal */}
      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        salonId={salon._id}
        onBookingConfirmed={handleConfirmBooking}
      />
    </>
  );
};

export default SalonDetailPage;