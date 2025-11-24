import React, { useState } from "react";
import { FaTimes, FaMapMarkerAlt, FaHome } from "react-icons/fa";
import Button from "./Button";

const BookingModal = ({
  isOpen,
  onClose,
  service,
  salonId,
  salonName,
  onBookingConfirmed,
}) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    preferredDateTime: "",
    location: "salon", // "salon" or "home"
  });

  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      // Prepare booking data
      const bookingData = {
        salonId,
        serviceId: service._id,
        serviceName: service.name,
        servicePrice: service.price,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        preferredDateTime: new Date(formData.preferredDateTime).toISOString(),
        location: formData.location,
      };

      const chatMessage = `Hello ${salonName}, I want to book an appointment for ${
        service.name
      } on ${formData.preferredDate} at ${formData.preferredTime} at ${
        formData.location === "home" ? "my home" : "your salon"
      }.\n Here is my phone number: ${formData.customerPhone}`;

      // Call the parent's booking confirmation handler
      onBookingConfirmed({
        ...bookingData,
        chatMessage,
      });
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
          <h2 className="text-2xl font-bold">Book Appointment</h2>
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
              {service.currency}
              {service.price}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Information
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  name="customerName"
                  placeholder="Full Name *"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  required
                />
                <input
                  type="tel"
                  name="customerPhone"
                  placeholder="Phone Number *"
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
                Preferred Date & Time
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
                Service Location
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
                  <span className="font-semibold">At Salon</span>
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
                  <span className="font-semibold">At Home</span>
                </button>
              </div>
              {formData.location === "home" && (
                <p className="text-sm text-gray-600 mt-2 bg-yellow-50 p-2 rounded">
                  Note: Home services may have additional fees. The salon will
                  confirm details in the chat.
                </p>
              )}
            </div>

            {/* Additional Notes */}
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                placeholder="Any special requests or details for the salon..."
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple resize-none"
              />
            </div> */}

            {/* Submit Section */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                After you book, you'll be able to chat directly with the salon
                to confirm details and discuss any special requests.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <Button
                variant="gradient"
                type="submit"
                disabled={loading}
                className="flex-1 !py-3"
              >
                {loading ? "Booking..." : "Request to Book"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingModal;
