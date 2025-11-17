import React from "react";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaHeart,
  FaStar,
  FaPlus,
  FaRegBookmark,
  FaHome,
} from "react-icons/fa";
import Button from "./Button";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className={
            index < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

const SalonCard = ({ salon }) => {
  if (!salon) return null;

  const displayImage =
    salon.photos && salon.photos.length > 0
      ? salon.photos[0]
      : "https://via.placeholder.com/400x300.png?text=BeautyHub";

  const offersHomeServices =
    salon.services &&
    salon.services.some((service) => service.homeServiceAvailable === true);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Image Section */}
      <div className="relative">
        <img
          className="w-full h-56 object-cover"
          src={displayImage || "/placeholder.svg"}
          alt={salon.name}
        />
        <div className="absolute top-3 right-3 bg-white rounded-full p-2 cursor-pointer">
          <FaHeart className="text-gray-400 hover:text-red-500" size={20} />
        </div>

        {offersHomeServices && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold">
            <FaHome size={14} />
            <span>Home Services</span>
          </div>
        )}

        {salon.isVerified && (
          <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
            <FaCheckCircle />
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-text-main">{salon.name}</h3>
          <div className="flex items-center space-x-1">
            <FaStar className="text-yellow-400" />
            <span className="font-bold text-text-main">
              {salon.averageRating?.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>
        <p className="text-sm text-text-muted mt-1">
          {salon.city}, {salon.address}
        </p>

        {/* The rest of the content remains the same, but now it will use live data */}
        <div className="flex-grow">
          <div className="flex justify-between items-center my-3">
            <div>
              <p className="text-xs text-text-muted">Starting from</p>
              <p className="font-bold text-lg text-text-main">
                {salon.startingPrice ? `₦${salon.startingPrice}` : "N/A"}
              </p>
            </div>
            <div className="text-right">
              <StarRating rating={salon.averageRating || 0} />
              <p className="text-xs text-text-muted">
                ({salon.reviews?.length || 0} reviews)
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm text-text-muted">
            <span>Responds in ~ an hour</span>
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span>Online</span>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Link to={`/salon/${salon._id}`} state={{ salon }} className="w-full">
            <Button variant="gradient" className="w-full !py-2.5">
              View & Book
            </Button>
          </Link>
          <button className="p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-100">
            <FaRegBookmark />
          </button>
          <button className="p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-100">
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;
