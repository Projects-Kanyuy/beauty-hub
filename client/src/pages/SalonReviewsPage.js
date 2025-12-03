import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSpinner, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { addReviewReply, fetchMySalon, fetchSalonReviews } from "../api";

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ))}
  </div>
);

const SalonReviewsPage = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({}); // Stores reply text, e.g., { reviewId: 'My reply text' }

  const loadReviews = async () => {
    try {
      const { data: salon } = await fetchMySalon();
      if (salon) {
        const { data: reviewsData } = await fetchSalonReviews(salon._id);
        setReviews(reviewsData);
      }
    } catch (err) {
      setError(t("salonreviews.loadFailed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [t]);

  const handleReplyChange = (reviewId, text) => {
    setReplyText((prev) => ({ ...prev, [reviewId]: text }));
  };

  const handleReplySubmit = async (reviewId) => {
    const text = replyText[reviewId];
    if (!text || text.trim() === "") {
      return toast.error(t("salonreviews.emptyReply"));
    }

    try {
      await addReviewReply(reviewId, { replyText: text });
      toast.success(t("salonreviews.replyPosted"));
      loadReviews();
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
    } catch (err) {
      toast.error(t("salonreviews.replyFailed"));
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );
  if (error)
    return (
      <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-lg">{t("salonreviews.errorTitle")}</h2>
        <p>{error}</p>
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">
        {t("salonreviews.header")}
      </h1>
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{review.user.name}</p>
                </div>
                <div className="text-right">
                  <StarRating rating={review.rating} />
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="my-4 text-text-muted italic">"{review.comment}"</p>
              {review.reply ? (
                <div className="border-l-4 border-primary-purple pl-4 py-2 bg-purple-50 rounded">
                  <p className="font-semibold text-sm text-primary-purple">
                    {t("salonreviews.yourReply")}
                  </p>
                  <p className="text-sm text-text-muted">{review.reply}</p>
                </div>
              ) : (
                <div>
                  <textarea
                    value={replyText[review._id] || ""}
                    onChange={(e) =>
                      handleReplyChange(review._id, e.target.value)
                    }
                    placeholder={t("salonreviews.replyPlaceholder")}
                    rows="2"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  ></textarea>
                  <button
                    onClick={() => handleReplySubmit(review._id)}
                    className="mt-2 px-4 py-2 bg-primary-purple text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity"
                  >
                    {t("salonreviews.postReply")}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-12 text-center rounded-lg shadow-sm">
            <p className="text-text-muted">{t("salonreviews.noReviews")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonReviewsPage;
