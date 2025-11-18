import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaHome,
  FaStar,
  FaPhone,
  FaMapMarkerAlt,
  FaImages,
  FaCheck,
  FaArrowLeft,
  FaChevronRight,
} from "react-icons/fa";
import Button from "../components/Button";
import BookingModal from "../components/BookingModal";
// import { createAppointment } from '../api/appointment';
import { useNavigate } from "react-router-dom";
import { fetchSalonById } from "../api";

const SalonDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [salon, setSalon] = useState(location.state?.salon || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(!salon);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (!salon) {
      const getSalon = async () => {
        try {
          setLoading(true);
          const { data } = await fetchSalonById(id);
          setSalon(data);
        } catch (err) {
          toast.error("Failed to load salon details");
          console.error(err);
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      getSalon();
    }
  }, [id, salon, navigate]);

  const handleBookClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (bookingData) => {
    try {
      // await createAppointment({
      //   salonId: bookingData.salonId,
      //   serviceId: bookingData.serviceId,
      //   serviceName: bookingData.serviceName,
      //   customerName: bookingData.customerName,
      //   customerPhone: bookingData.customerPhone,
      //   preferredDate: bookingData.preferredDate,
      //   preferredTime: bookingData.preferredTime,
      //   location: bookingData.location,
      //   notes: bookingData.notes,
      // });

      // create appoitment

      const chatPayload = {
        salonId: bookingData.salonId,
        customerName: bookingData.customerName,
        initialMessage: bookingData.chatMessage,
      };

      toast.success(
        "Appointment requested successfully! Opening chat with the salon..."
      );
      setIsModalOpen(false);

      setTimeout(() => {
        navigate("/chat");
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Booking failed. Please try again."
      );
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading salon details...</div>;
  }

  if (!salon) {
    return (
      <div className="text-center py-20 text-red-600">
        Failed to load salon. Please go back and try again.
      </div>
    );
  }

  const displayImage =
    salon.photos && salon.photos.length > 0
      ? salon.photos[currentPhotoIndex]
      : "https://via.placeholder.com/1200x600.png?text=BeautyHub";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-primary-purple hover:text-primary-purple/80 transition-colors font-medium"
          >
            <FaArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div
        className="relative h-80 md:h-[300px] lg:h-[400px] bg-cover bg-center group"
        style={{ backgroundImage: `url(${displayImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Photo navigation arrows */}
        {salon.photos && salon.photos.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={() =>
                setCurrentPhotoIndex(
                  (prev) =>
                    (prev - 1 + salon.photos.length) % salon.photos.length
                )
              }
              className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
            >
              ◀
            </button>
            <button
              onClick={() =>
                setCurrentPhotoIndex((prev) => (prev + 1) % salon.photos.length)
              }
              className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
            >
              ▶
            </button>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-end py-6 md:py-8 px-4 md:px-10 lg:px-28 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{salon.name}</h1>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              <FaStar className="text-yellow-300" />
              <span className="font-bold text-lg">
                {salon.averageRating?.toFixed(1) || "New"}
              </span>
              <span className="text-gray-200">
                ({salon.reviews?.length || 0} reviews)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt />
              <span>
                {salon.city}, {salon.address}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaPhone />
              <span>{salon.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Services) - spans 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services Section */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Services</h2>
              <ul className="space-y-5">
                {salon.services && salon.services.length > 0 ? (
                  salon.services.map((service) => (
                    <li
                      key={service._id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-5 last:border-b-0"
                    >
                      <div className="flex-1 mb-4 sm:mb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-2 sm:gap-0">
                          <h3 className="font-semibold text-lg">
                            {service.name}
                          </h3>
                          {service.homeServiceAvailable && (
                            <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full w-fit">
                              <FaHome size={12} />
                              <span>Home Service</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-muted mt-2 max-w-md">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <span className="font-bold text-lg text-primary-purple">
                          ₦{service.price.toLocaleString()}
                        </span>
                        <Button
                          variant="gradient"
                          className="!py-2 !px-6 whitespace-nowrap"
                          onClick={() => handleBookClick(service)}
                        >
                          Book
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-text-muted text-center py-8">
                    No services listed for this salon yet.
                  </p>
                )}
              </ul>
            </div>

            {/* About Section */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">About This Salon</h2>
              <p className="text-text-muted leading-relaxed">
                {salon.description ||
                  "Professional beauty salon dedicated to providing quality services. Visit us to experience our expertise and friendly atmosphere."}
              </p>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1">
            {/* Quick Info Card */}
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4 space-y-6">
              {salon.photos && salon.photos.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                    <FaImages />
                    <span>Gallery</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {salon.photos.slice(0, 4).map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo || "/placeholder.svg"}
                        alt={`${salon.name} gallery ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setCurrentPhotoIndex(idx)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">
                  Why Book With Us?
                </h4>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-start space-x-2">
                    <FaCheck className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Easy booking & chat support</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheck className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Professional stylists</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheck className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Quality services</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        salonId={salon._id}
        salonName={salon.name}
        onBookingConfirmed={handleConfirmBooking}
      />
    </div>
  );
};

export default SalonDetailPage;
