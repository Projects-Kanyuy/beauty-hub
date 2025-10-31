// src/pages/SalonReviewsPage.js
import React, { useState, useEffect } from 'react';
import { fetchMySalon, fetchSalonReviews, addReviewReply } from '../api';
import { toast } from 'react-toastify';
import { FaStar, FaSpinner } from 'react-icons/fa';

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />)}
  </div>
);

const SalonReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({}); // Stores reply text, e.g., { reviewId: 'My reply text' }

  const loadReviews = async () => {
    try {
      // Don't need to show loader on manual refresh
      // setLoading(true); 
      const { data: salon } = await fetchMySalon();
      if (salon) {
        const { data: reviewsData } = await fetchSalonReviews(salon._id);
        setReviews(reviewsData);
      }
    } catch (err) {
      setError("Could not load reviews. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleReplyChange = (reviewId, text) => {
    setReplyText(prev => ({ ...prev, [reviewId]: text }));
  };

  const handleReplySubmit = async (reviewId) => {
    const text = replyText[reviewId];
    if (!text || text.trim() === '') {
      return toast.error("Reply cannot be empty.");
    }

    try {
      await addReviewReply(reviewId, { replyText: text });
      toast.success("Reply posted successfully!");
      loadReviews(); // Refresh the list to show the new reply
      setReplyText(prev => ({ ...prev, [reviewId]: '' })); // Clear the input
    } catch (err) {
      toast.error("Failed to post reply.");
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl text-primary-purple" /></div>;
  if (error) return <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md"><h2 className="font-bold text-lg">Error</h2><p>{error}</p></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">Customer Reviews</h1>
      <div className="space-y-6">
        {reviews.length > 0 ? reviews.map(review => (
          <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">{review.user.name}</p>
                {/* Add service if available in your model */}
                {/* <p className="text-sm text-text-muted">Reviewed: {review.service}</p> */}
              </div>
              <div className="text-right">
                <StarRating rating={review.rating} />
                <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="my-4 text-text-muted italic">"{review.comment}"</p>
            {review.reply ? (
              <div className="border-l-4 border-primary-purple pl-4 py-2 bg-purple-50 rounded">
                <p className="font-semibold text-sm text-primary-purple">Your Reply:</p>
                <p className="text-sm text-text-muted">{review.reply}</p>
              </div>
            ) : (
              <div>
                <textarea 
                  value={replyText[review._id] || ''} 
                  onChange={(e) => handleReplyChange(review._id, e.target.value)} 
                  placeholder="Write a public reply..." 
                  rows="2" 
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple"
                ></textarea>
                <button 
                  onClick={() => handleReplySubmit(review._id)} 
                  className="mt-2 px-4 py-2 bg-primary-purple text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity"
                >
                  Post Reply
                </button>
              </div>
            )}
          </div>
        )) : (
          <div className="bg-white p-12 text-center rounded-lg shadow-sm">
            <p className="text-text-muted">You have no reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default SalonReviewsPage;