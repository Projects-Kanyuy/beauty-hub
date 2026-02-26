import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft, FaImages, FaMapMarkerAlt, FaPhone, FaStar, FaSpinner
} from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createAppointment, addReview } from "../api";
import { useSalon } from "../api/swr";
import { useAuth } from "../context/AuthContext";
import BookingModal from "../components/BookingModal";
import Button from "../components/Button";

const SalonDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();

  const [salon, setSalon] = useState(location.state?.salon || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState(null); 

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", guestName: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const { data: salonData, isLoading, mutate } = useSalon(id);
  const resolvedSalon = useMemo(() => salonData || salon, [salon, salonData]);

  useEffect(() => {
    if (salonData && !salon) setSalon(salonData);
  }, [salonData, salon]);

  const handleBookClick = (service) => {
    setSelectedService(service); 
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await addReview(resolvedSalon._id, reviewForm);
      toast.success("Review posted!");
      setReviewForm({ rating: 5, comment: "", guestName: "" });
      mutate(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

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
    <div className="bg-gray-50 min-h-screen pb-20">
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
              <span className="font-bold">{resolvedSalon.averageRating?.toFixed(1) || "New"}</span>
              <span className="opacity-80">({resolvedSalon.reviews?.length || 0} {t("salondetail.reviews")})</span>
            </div>
            <div className="flex items-center space-x-2"><FaMapMarkerAlt /> <span>{resolvedSalon.city}, {resolvedSalon.address}</span></div>
            <div className="flex items-center space-x-2"><FaPhone /> <span>{resolvedSalon.phone}</span></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                          <img key={i} src={img} className="w-20 h-20 rounded-xl object-cover border border-gray-100 shadow-sm" alt="Service" />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Client Reviews</h2>
              <div className="space-y-6 mb-10">
                {resolvedSalon.reviews?.length > 0 ? resolvedSalon.reviews.map((rev, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-2xl relative">
                    <div className="flex text-orange-400 mb-2">
                      {/* FIX: Ensure stars show based on rev.rating */}
                      {[...Array(5)].map((_, j) => (
                        <FaStar key={j} size={10} className={j < rev.rating ? "text-orange-400" : "text-gray-200"} />
                      ))}
                    </div>
                    {/* FIX: Ensure comment is shown */}
                    <p className="text-gray-600 mb-2">"{rev.comment}"</p>
                    {/* FIX: Priority given to registered user name, then guest name */}
                    <p className="font-bold text-gray-800 text-sm">— {rev.user?.name || rev.guestName || "Client"}</p>
                  </div>
                )) : <p className="text-gray-400 italic">No reviews yet. Be the first!</p>}
              </div>

              <div className="border-t pt-8">
                <h3 className="font-bold text-lg mb-4">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {!user && (
                    <input 
                      type="text"
                      placeholder="Your Name"
                      value={reviewForm.guestName}
                      onChange={(e) => setReviewForm({...reviewForm, guestName: e.target.value})}
                      className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple font-bold"
                      required
                    />
                  )}
                  <div className="flex gap-2 text-2xl text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewForm({...reviewForm, rating: s})}>
                        {s <= reviewForm.rating ? "★" : "☆"}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="Describe your experience..."
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple"
                    rows="3" required
                  />
                  <Button type="submit" disabled={submittingReview} className="rounded-full px-8">
                    {submittingReview ? "Posting..." : "Post Review"}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
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