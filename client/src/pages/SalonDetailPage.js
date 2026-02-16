import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft,
  FaCheck,
  FaHome,
  FaImages,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
} from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createAppointment } from "../api";
import { useSalon } from "../api/swr";
import BookingModal from "../components/BookingModal";
import Button from "../components/Button";

const SalonDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [salon, setSalon] = useState(location.state?.salon || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { data: salonData, isLoading } = useSalon(id);

  const resolvedSalon = useMemo(() => salon || salonData, [salon, salonData]);

  useEffect(() => {
    if (salonData && !salon) {
      setSalon(salonData);
    }
  }, [salonData, salon]);

  const handleBookClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (bookingData) => {
    try {
      // 1. CALL API TO CREATE APPOINTMENT (Ghost or Registered)
      await createAppointment({
        salonId: bookingData.salonId,
        serviceId: bookingData.serviceId,
        appointmentDateTime: bookingData.preferredDateTime,
        clientName: bookingData.customerName,
        clientNumber: bookingData.customerPhone,
        homeService: bookingData.location === "home",
      });

      toast.success(t("salondetail.bookingSuccess"));
      setIsModalOpen(false);

      // 2. WHATSAPP REDIRECTION
      // Format phone number (remove any non-numeric characters)
      const rawPhone = resolvedSalon?.phone || "";
      const formattedPhone = rawPhone.replace(/[^0-9]/g, "");
      
      // Use encodeURIComponent to handle special characters in the message safely
      const message = encodeURIComponent(bookingData?.chatMessage || "");
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
      
      window.open(whatsappUrl, "_blank");
    } catch (err) {
      toast.error(
        err.response?.data?.message || t("salondetail.bookingFailed")
      );
      console.error("Booking Confirm Error:", err);
    }
  };

  if (isLoading && !resolvedSalon) {
    return <div className="text-center py-20">{t("salondetail.loading")}</div>;
  }

  if (!resolvedSalon) {
    return (
      <div className="text-center py-20 text-red-600">
        {t("salondetail.loadFailedGoBack")}
      </div>
    );
  }

  const displayImage =
    resolvedSalon.photos && resolvedSalon.photos.length > 0
      ? resolvedSalon.photos[currentPhotoIndex]
      : "https://via.placeholder.com/1200x600.png?text=BeautyHeaven";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-primary-purple hover:text-primary-purple/80 transition-colors font-medium"
          >
            <FaArrowLeft size={16} />
            <span>{t("salondetail.back")}</span>
          </button>
        </div>
      </div>

      <div
        className="relative h-80 md:h-[300px] lg:h-[400px] bg-cover bg-center group"
        style={{ backgroundImage: `url(${displayImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {resolvedSalon.photos && resolvedSalon.photos.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={() =>
                setCurrentPhotoIndex(
                  (prev) =>
                    (prev - 1 + resolvedSalon.photos.length) % resolvedSalon.photos.length
                )
              }
              className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
            >
              ◀
            </button>
            <button
              onClick={() =>
                setCurrentPhotoIndex((prev) => (prev + 1) % resolvedSalon.photos.length)
              }
              className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
            >
              ▶
            </button>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-end py-6 md:py-8 px-4 md:px-10 lg:px-28 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{resolvedSalon.name}</h1>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              <FaStar className="text-yellow-300" />
              <span className="font-bold text-lg">
                {resolvedSalon.averageRating?.toFixed(1) || t("salondetail.new")}
              </span>
              <span className="text-gray-200">
                ({resolvedSalon.reviews?.length || 0} {t("salondetail.reviews")})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt />
              <span>
                {resolvedSalon.city}, {resolvedSalon.address}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaPhone />
              <span>{resolvedSalon.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">
                {t("salondetail.services")}
              </h2>
              <ul className="space-y-5">
                {resolvedSalon.services && resolvedSalon.services.length > 0 ? (
                  resolvedSalon.services.map((service) => (
                    <li
                      key={service._id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-5 last:border-b-0"
                    >
                      <div className="flex-1 mb-4 sm:mb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-2 sm:gap-0">
                          <h3 className="font-semibold text-lg">
                            {service.name}
                          </h3>
                          {service.homeService && (
                            <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full w-fit">
                              <FaHome size={12} />
                              <span>{t("salondetail.homeService")}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-muted mt-2 max-w-md">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <span className="font-bold text-lg text-primary-purple">
                          {resolvedSalon.currency}
                          {service.price}
                        </span>
                        <Button
                          variant="gradient"
                          className="!py-2 !px-6 whitespace-nowrap"
                          onClick={() => handleBookClick(service)}
                        >
                          {t("salondetail.book")}
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-text-muted text-center py-8">
                    {t("salondetail.noServices")}
                  </p>
                )}
              </ul>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">
                {t("salondetail.aboutSalon")}
              </h2>
              <p className="text-text-muted leading-relaxed">
                {resolvedSalon.description || t("salondetail.aboutSalonPlaceholder")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4 space-y-6">
              {resolvedSalon.photos && resolvedSalon.photos.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                    <FaImages />
                    <span>{t("salondetail.gallery")}</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {resolvedSalon.photos.slice(0, 4).map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo || "/placeholder.svg"}
                        alt={`${resolvedSalon.name} ${t("salondetail.gallery")} ${
                          idx + 1
                        }`}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setCurrentPhotoIndex(idx)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">
                  {t("salondetail.whyBook")}
                </h4>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-start space-x-2">
                    <FaCheck className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{t("salondetail.easyBooking")}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheck className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{t("salondetail.professionalStylists")}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheck className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{t("salondetail.qualityServices")}</span>
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
        salonId={resolvedSalon?._id || resolvedSalon?.id}
        salonName={resolvedSalon?.name}
        onBookingConfirmed={handleConfirmBooking}
      />
    </div>
  );
};

export default SalonDetailPage;