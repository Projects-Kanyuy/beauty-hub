import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCheckCircle,
  FaHeart,
  FaHome,
  FaPlus,
  FaRegBookmark,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "./Button";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          size={12}
          className={
            index < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

const SalonCard = ({ salon }) => {
  const { t } = useTranslation();

  const minPrice = useMemo(() => {
    if (!salon || !salon.services || salon.services.length === 0) return null;
    const prices = salon.services.map((s) => s.price);
    return Math.min(...prices);
  }, [salon]);

  if (!salon) return null;

  // --- LOGIC FOR REAL REVIEWS (NOT HARDCODED) ---
  const rating = salon.averageRating || 0;
  const reviewCount = salon.reviews?.length || 0;

  const getRandomPurple = () => {
    const colors = ["a855f7", "d946ef", "8b5cf6", "ec4899", "9333ea"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const displayImage =
    salon.photos && salon.photos.length > 0
      ? salon.photos[0]
      : `https://placehold.co/400x300/${getRandomPurple()}/ffffff?text=${encodeURIComponent(
          salon.name.slice(0, 2).toUpperCase()
        )}&font=playfair-display`;

  const offersHomeServices =
    salon.services &&
    salon.services.some((service) => service.homeService === true);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative">
        <img className="w-full h-56 object-cover" src={displayImage} alt={salon.name} />
        <div className="absolute top-3 right-3 bg-white rounded-full p-2 cursor-pointer">
          <FaHeart className="text-gray-400 hover:text-red-500" size={20} />
        </div>
        {offersHomeServices && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold">
            <FaHome size={14} />
            <span>{t("salonCard.homeServices")}</span>
          </div>
        )}
        {salon.isVerified && (
          <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
            <FaCheckCircle />
            <span>{t("salonCard.verified")}</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-text-main line-clamp-1">{salon.name}</h3>
          <div className="flex items-center space-x-1">
            <FaStar className={rating > 0 ? "text-yellow-400" : "text-gray-300"} />
            <span className="font-bold text-text-main">
              {rating > 0 ? rating.toFixed(1) : "New"}
            </span>
          </div>
        </div>

        <p className="text-sm text-text-muted mt-1 truncate">{salon.city}, {salon.address}</p>

        <div className="flex-grow">
          <div className="flex justify-between items-center my-3">
            <div>
              <p className="text-xs text-text-muted">{t("salonCard.startingFrom")}</p>
              <p className="font-bold text-lg text-primary-purple">
                {minPrice ? `${salon.currency || 'XAF'} ${minPrice}` : `XAF 2,500`}
              </p>
            </div>
            <div className="text-right">
              <StarRating rating={rating} />
              <p className="text-xs text-text-muted">({reviewCount} {t("salonCard.reviews")})</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm text-text-muted">
            <span>{t("salonCard.online")}</span>
            <span className="flex items-center space-x-1.5"><span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span></span>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Link to={`/salon/${salon._id}`} state={{ salon }} className="w-full">
            <Button variant="gradient" className="w-full !py-2.5 rounded-xl">{t("salonCard.viewAndBook")}</Button>
          </Link>
          <button className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50"><FaRegBookmark /></button>
          <button className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50"><FaPlus /></button>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;