import { useEffect, useState, useCallback } from "react"; // Added useCallback
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft, FaImages, FaMapMarkerAlt, FaStar, FaSpinner
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom"; // Removed useLocation, no longer needed
import { toast } from "react-toastify";
import { createAppointment, addReview, getSalonBySlug } from "../api"; 
import { useAuth } from "../context/AuthContext";
import BookingModal from "../components/BookingModal";
import Button from "../components/Button";

const SalonDetailPage = () => {
  const { t } = useTranslation();
  const { id: slug } = useParams(); // 'id' in the route is now our 'slug'
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const [salon, setSalon] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", guestName: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  // 1. Fetch Salon Details by SLUG (Wrapped in useCallback)
  const fetchSalonData = useCallback(async () => {
    try {
      setFetching(true);
      const { data } = await getSalonBySlug(slug);
      setSalon(data.data);
    } catch (err) {
      console.error("Load Error:", err);
      toast.error("Could not load salon details");
    } finally {
      setFetching(false);
    }
  }, [slug]); // Dependencies for useCallback

  useEffect(() => {
    fetchSalonData();
  }, [fetchSalonData]); // fetchSalonData is now a stable dependency

  const handleBookClick = (service) => {
    setSelectedService(service); 
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!salon?._id) return;
    setSubmittingReview(true);
    try {
      // Assuming addReview needs userId for authenticated reviews
      const reviewPayload = user 
        ? { ...reviewForm, user: user._id } 
        : reviewForm;

      await addReview(salon._id, reviewPayload);
      toast.success("Review posted!");
      setReviewForm({ rating: 5, comment: "", guestName: "" });
      fetchSalonData(); // Refresh data to show new review
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleConfirmBooking = async (bookingData) => {
    try {
      await createAppointment({
        salonId: salon._id,
        serviceId: bookingData.serviceId,
        appointmentDateTime: bookingData.preferredDateTime,
        clientName: bookingData.customerName,
        clientNumber: bookingData.customerPhone,
        homeService: bookingData.location === "home",
      });
      toast.success(t("salondetail.bookingSuccess"));
      setIsModalOpen(false);
      
      const phoneClean = salon?.phone?.replace(/[^0-9]/g, "");
      const whatsappUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(bookingData?.chatMessage)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err.response?.data?.message || t("salondetail.bookingFailed"));
    }
  };

  if (fetching) return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-primary-purple text-5xl" /></div>;
  if (!salon) return <div className="text-center py-20 text-red-600 font-bold">{t("salondetail.loadFailedGoBack")}</div>;

  const displayImage = salon.photos?.length > 0
      ? salon.photos[currentPhotoIndex]
      : "https://via.placeholder.com/1200x600.png?text=BeautyHeaven";

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-primary-purple font-bold hover:opacity-70 transition">
            <FaArrowLeft size={16} /> <span>{t("salondetail.back")}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${displayImage})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex flex-col justify-end py-12 px-6 lg:px-24 text-white">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">{salon.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
              <FaStar className="text-yellow-400" /> 
              <span>{salon.averageRating?.toFixed(1) || "New"}</span>
              <span className="opacity-70">({salon.reviews?.length || 0} {t("salondetail.reviews")})</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
                <FaMapMarkerAlt /> <span>{salon.city}, {salon.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Services Card */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black mb-8 tracking-tight">{t("salondetail.services")}</h2>
              <div className="space-y-8">
                {salon.services?.map((service) => (
                  <div key={service._id} className="group border-b border-gray-100 pb-8 last:border-0">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl text-gray-900 group-hover:text-primary-purple transition-colors">{service.name}</h3>
                        <p className="text-gray-500 mt-2 leading-relaxed">{service.description}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Starting at</p>
                            <p className="font-black text-2xl text-primary-purple">{salon.currency} {service.price}</p>
                        </div>
                        <Button variant="gradient" className="!py-3 !px-10 rounded-full text-lg shadow-lg active:scale-95" onClick={() => handleBookClick(service)}>
                          {t("salondetail.book")}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black mb-8 tracking-tight">Client Feedback</h2>
              <div className="space-y-6 mb-12">
                {salon.reviews?.length > 0 ? salon.reviews.map((rev, i) => (
                  <div key={i} className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex gap-1 text-orange-400 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <FaStar key={j} size={14} className={j < rev.rating ? "fill-current" : "text-gray-200"} />
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg italic leading-relaxed">"{rev.comment}"</p>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-purple/10 rounded-full flex items-center justify-center text-primary-purple font-bold text-xs uppercase">
                            {(rev.user?.name || rev.guestName || "C")[0]}
                        </div>
                        <p className="font-black text-gray-900 text-sm uppercase tracking-wider">— {rev.user?.name || rev.guestName || "Verified Client"}</p>
                    </div>
                  </div>
                )) : <p className="text-gray-400 text-center py-10 font-medium">No reviews yet. Be the first!</p>}
              </div>

              {/* Review Form */}
              <div className="bg-primary-purple/5 p-8 rounded-3xl border border-primary-purple/10">
                <h3 className="font-black text-xl mb-6">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  {!user && (
                    <input 
                      type="text"
                      placeholder="Your Name"
                      value={reviewForm.guestName}
                      onChange={(e) => setReviewForm({...reviewForm, guestName: e.target.value})}
                      className="w-full p-4 bg-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple font-bold shadow-sm"
                      required
                    />
                  )}
                  <div className="flex gap-2 text-3xl">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewForm({...reviewForm, rating: s})} className="transition-transform hover:scale-110">
                        {s <= reviewForm.rating ? <FaStar className="text-yellow-400" /> : <FaStar className="text-gray-200" />}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="Tell us about your experience..."
                    className="w-full p-6 bg-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-purple shadow-sm"
                    rows="4" required
                  />
                  <Button type="submit" disabled={submittingReview} className="rounded-full px-12 !py-4 text-lg">
                    {submittingReview ? <FaSpinner className="animate-spin" /> : "Post Review"}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar Gallery */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-28">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <FaImages className="text-primary-purple" /> <span>{t("salondetail.gallery")}</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {salon.photos?.map((photo, idx) => (
                  <img key={idx} src={photo} className="w-full h-28 object-cover rounded-2xl cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentPhotoIndex(idx)} alt="Gallery" />
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
        salonId={salon?._id}
        salonName={salon?.name}
        onBookingConfirmed={handleConfirmBooking}
      />
    </div>
  );
};

export default SalonDetailPage;