import React, { useState, useEffect } from "react";
import { FaTimes, FaMapMarkerAlt, FaHome, FaImages } from "react-icons/fa";
import Button from "./Button";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const BookingModal = ({
  isOpen,
  onClose,
  service,
  salonId,
  salonName,
  onBookingConfirmed,
  onImageClick, // NEW PROP: To trigger the lightbox from the parent
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    preferredDateTime: "",
    location: "salon",
  });

  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const sId = service._id || service.id;
      const appointmentDate = new Date(formData.preferredDateTime);
      const readableDate = appointmentDate.toLocaleDateString();
      const readableTime = appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const bookingData = {
        salonId,
        serviceId: sId,
        serviceName: service.name,
        servicePrice: service.price,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        preferredDateTime: appointmentDate.toISOString(),
        location: formData.location,
      };

      const chatMessage = `Hello ${salonName}, I want to book an appointment for ${service.name} on ${readableDate} at ${readableTime} at ${formData.location === "home" ? "my home" : "your salon"}.\n\nClient Details:\nName: ${formData.customerName}\nPhone: ${formData.customerPhone}`;

      if (onBookingConfirmed) {
        await onBookingConfirmed({ ...bookingData, chatMessage });
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] backdrop-blur-sm" onClick={onClose} />
      )}

      <div
        className={`fixed bottom-0 md:bottom-[4vh] left-0 right-0 z-[110] bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl max-w-2xl mx-auto w-full transition-transform duration-500 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="sticky top-0 bg-white border-b flex justify-between items-center p-6 md:p-8 rounded-t-[2.5rem] z-20">
          <h2 className="text-2xl font-black tracking-tight">{t("booking.title")}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl transition-colors"><FaTimes /></button>
        </div>

        <div className="p-6 md:p-8">
          {/* --- UPDATED SERVICE SUMMARY WITH SCROLLABLE IMAGES --- */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-3xl mb-8 shadow-xl overflow-hidden">
            <div className="p-6">
                <h3 className="text-xl font-bold">{service.name}</h3>
                <p className="text-purple-100 text-sm mt-1 line-clamp-1 opacity-80">{service.description}</p>
                <p className="text-3xl font-black mt-2">
                    {service.currency || 'XAF'} {service.price?.toLocaleString()}
                </p>
            </div>
            
            {/* HORIZONTAL IMAGE LIST */}
            {service.photos && service.photos.length > 0 && (
                <div className="flex gap-3 overflow-x-auto p-6 pt-0 scrollbar-hide">
                    {service.photos.map((photo, index) => (
                        <div 
                          key={index} 
                          onClick={() => onImageClick(service.photos, index)}
                          className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 border-white/20 cursor-zoom-in hover:scale-105 transition-transform"
                        >
                            <img src={photo} className="w-full h-full object-cover" alt={`${service.name} ${index}`} />
                            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                        </div>
                    ))}
                </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">{t("booking.yourInfo")}</label>
              <div className="space-y-3">
                <input type="text" name="customerName" placeholder={t("booking.fullName")} value={formData.customerName} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none" required />
                <input type="tel" name="customerPhone" placeholder={t("booking.phone")} value={formData.customerPhone} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">{t("booking.dateTime")}</label>
              <input type="datetime-local" name="preferredDateTime" value={formData.preferredDateTime} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none font-bold" required />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">{t("booking.location")}</label>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => handleLocationToggle("salon")} className={`p-5 border-2 rounded-2xl transition-all flex items-center justify-center space-x-3 font-bold ${formData.location === "salon" ? "border-primary-purple bg-purple-50 text-primary-purple" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}>
                  <FaMapMarkerAlt /> <span>{t("booking.atSalon")}</span>
                </button>
                <button type="button" onClick={() => handleLocationToggle("home")} className={`p-5 border-2 rounded-2xl transition-all flex items-center justify-center space-x-3 font-bold ${formData.location === "home" ? "border-primary-purple bg-purple-50 text-primary-purple" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}>
                  <FaHome /> <span>{t("booking.atHome")}</span>
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="gradient" type="submit" disabled={loading} className="flex-1 !py-5 rounded-full text-lg shadow-xl font-bold">
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