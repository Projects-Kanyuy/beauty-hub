import React, { useState, useEffect } from "react";
import { FaTimes, FaMapMarkerAlt, FaHome } from "react-icons/fa";
import Button from "./Button";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext"; // Added to handle logged-in users

const BookingModal = ({
  isOpen,
  onClose,
  service,
  salonId,
  salonName,
  onBookingConfirmed,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth(); // Get user info

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    preferredDateTime: "",
    location: "salon", // "salon" or "home"
  });

  const [loading, setLoading] = useState(false);

  // --- 1. AUTO-FILL DATA IF USER IS LOGGED IN ---
  useEffect(() => {
    if (user && isOpen) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name || "",
        customerPhone: user.phone || "",
      }));
    }
  }, [user, isOpen]);

  if (!isOpen || !service) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationToggle = (loc) => {
    setFormData((prev) => ({ ...prev, location: loc }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- 2. CRITICAL SAFETY GUARD ---
    if (!service || !salonId) {
      console.error("Missing booking details");
      return;
    }

    setLoading(true);

    try {
      // --- 3. PREPARE IDS SAFELY ---
      const sId = service._id || service.id;
      
      // --- 4. FORMAT DATE FOR WHATSAPP MESSAGE ---
      const appointmentDate = new Date(formData.preferredDateTime);
      const dateString = appointmentDate.toLocaleDateString();
      const timeString = appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Prepare booking data
      const bookingData = {
        salonId: salonId,
        serviceId: sId,
        serviceName: service.name,
        servicePrice: service.price,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        preferredDateTime: appointmentDate.toISOString(),
        location: formData.location,
      };

      // Corrected variables for the message
      const chatMessage = `Hello ${salonName}, I want to book an appointment for ${
        service.name
      } on ${dateString} at ${timeString} at ${
        formData.location === "home" ? "my home" : "your salon"
      }.\n\nMy details:\nName: ${formData.customerName}\nPhone: ${formData.customerPhone}`;

      // Call the parent's booking confirmation handler
      if (onBookingConfirmed) {
        await onBookingConfirmed({
          ...bookingData,
          chatMessage,
        });
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Modal */}
      <div
        className={`fixed bottom-[4vh] rounded-2xl left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-w-2xl mx-auto w-full transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b flex justify-between items-center p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold">{t("booking.title")}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Service Summary */}
          <div className="bg-gradient-to-r from-primary-purple to-primary-pink text-white p-4 rounded-lg mb-6">
            <h3 className="text-lg font-bold">{service.name}</h3>
            <p className="text-sm mt-1">{service.description}</p>
            <p className="text-2xl font-bold mt-3">
              {service.currency || 'XAF'} {service.price}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t("booking.yourInfo")}
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  name="customerName"
                  placeholder={t("booking.fullName")}
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  required
                />
                <input
                  type="tel"
                  name="customerPhone"
                  placeholder={t("booking.phone")}
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  required
                />
              </div>
            </div>

            {/* Appointment Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t("booking.dateTime")}
              </label>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="datetime-local"
                  name="preferredDateTime"
                  value={formData.preferredDateTime}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  required
                />
              </div>
            </div>

            {/* Location Preference */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t("booking.location")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleLocationToggle("salon")}
                  className={`p-4 border-2 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                    formData.location === "salon"
                      ? "border-primary-purple bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FaMapMarkerAlt className="text-xl" />
                  <span className="font-semibold">{t("booking.atSalon")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLocationToggle("home")}
                  className={`p-4 border-2 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                    formData.location === "home"
                      ? "border-primary-pink bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FaHome className="text-xl" />
                  <span className="font-semibold">{t("booking.atHome")}</span>
                </button>
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                {t("booking.afterBooking")}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                {t("booking.cancel")}
              </button>
              <Button
                variant="gradient"
                type="submit"
                disabled={loading}
                className="flex-1 !py-3"
              >
                {loading ? t("booking.loading") : t("booking.submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingModal;