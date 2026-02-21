import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft, FaImages, FaMapMarkerAlt, FaPhone, FaStar, FaSpinner,  FaQuoteLeft
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
  const [zoomImage, setZoomImage] = useState(null); 
  
  const { data: salonData, isLoading } = useSalon(id);
  const resolvedSalon = useMemo(() => salonData || salon, [salon, salonData]);

  useEffect(() => {
    if (salonData && !salon) setSalon(salonData);
  }, [salonData, salon]);

  const handleBookClick = (service) => {
    setSelectedService(service); 
    setIsModalOpen(true);
  };

  // --- FIXED TESTIMONIALS DATA ---
  const fixedReviews = [
    { name: "Amina B.", comment: "The best service in Douala. Very professional and fast!", rating: 5 },
    { name: "Cynthia K.", comment: "Love my new braids! The attention to detail is amazing.", rating: 5 },
  ];

  const handleConfirmBooking = async (bookingData) => {
    try {
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
      const phone = resolvedSalon?.phone?.replace(/[^0-9]/g, "");
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(bookingData?.chatMessage)}`;
      window.open(whatsappUrl, "_blank");
    } catch (err) {
      toast.error(err.response?.data?.message || t("salondetail.bookingFailed"));
    }
  };

  if (isLoading && !resolvedSalon) return <div className="text-center py-20"><FaSpinner className="animate-spin text-primary-purple text-4xl" /></div>;
  if (!resolvedSalon) return <div className="text-center py-20 text-red-600">{t("salondetail.loadFailedGoBack")}</div>;

  const displayImage = resolvedSalon.photos?.length > 0
      ? resolvedSalon.photos[currentPhotoIndex]
      : "https://via.placeholder.com/1200x600.png?text=BeautyHeaven";

  return (
    <div className="bg-gray-50 min-h-screen">
      {zoomImage && (
        <div className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} className="max-w-full max-h-full rounded-2xl shadow-2xl" alt="Zoom" />
        </div>
      )}

      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-primary-purple font-medium">
            <FaArrowLeft size={16} /> <span>{t("salondetail.back")}</span>
          </button>
        </div>
      </div>

      <div className="relative h-80 md:h-[400px] bg-cover bg-center group" style={{ backgroundImage: `url(${displayImage})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex flex-col justify-end py-10 px-10 lg:px-28 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">{resolvedSalon.name}</h1>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              <FaStar className="text-yellow-300" /> 
              {/* FIXED RATING */}
              <span className="font-bold">4.9</span>
              <span className="opacity-80">(128 {t("salondetail.reviews")})</span>
            </div>
            <div className="flex items-center space-x-2"><FaMapMarkerAlt /> <span>{resolvedSalon.city}, {resolvedSalon.address}</span></div>
            <div className="flex items-center space-x-2"><FaPhone /> <span>{resolvedSalon.phone}</span></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">{t("salondetail.services")}</h2>
              <ul className="space-y-8">
                {resolvedSalon.services?.map((service) => (
                  <li key={service._id} className="border-b border-gray-50 pb-8 last:border-b-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl">{service.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                      </div>
                      <div className="flex items-center space-x-6">
                        <span className="font-bold text-xl text-primary-purple">{resolvedSalon.currency} {service.price}</span>
                        <Button variant="gradient" className="!py-2 !px-8 rounded-full" onClick={() => handleBookClick(service)}>
                          {t("salondetail.book")}
                        </Button>
                      </div>
                    </div>
                    {service.photos?.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {service.photos.map((img, i) => (
                          <img key={i} src={img} className="w-20 h-20 rounded-xl object-cover cursor-zoom-in border border-gray-100 shadow-sm" onClick={() => setZoomImage(img)} alt="Service" />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* FIXED REVIEWS SECTION */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Client Testimonials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fixedReviews.map((rev, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-2xl relative">
                    <FaQuoteLeft className="text-purple-200 absolute top-4 right-4 text-2xl" />
                    <div className="flex text-orange-400 mb-3">
                      {[...Array(rev.rating)].map((_, j) => <FaStar key={j} size={12} />)}
                    </div>
                    <p className="text-gray-600 italic mb-4">"{rev.comment}"</p>
                    <p className="font-bold text-gray-800 text-sm">— {rev.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><FaImages /> <span>{t("salondetail.gallery")}</span></h3>
              <div className="grid grid-cols-2 gap-2">
                {resolvedSalon.photos?.slice(0, 4).map((photo, idx) => (
                  <img key={idx} src={photo} className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setCurrentPhotoIndex(idx)} alt="Gallery" />
                ))}
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