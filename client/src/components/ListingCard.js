// src/components/ListingCard.js
import { useTranslation } from "react-i18next";
import StarRating from "./StarRating"; // We will create this next

const ListingCard = ({ listing }) => {
  // Destructure the props for easier access
  const { imageUrl, name, address, rating, reviewCount } = listing;
  const { t } = useTranslation(); // Hook for translations

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="font-heading text-xl font-bold text-secondary mb-1">
          {name}
        </h3>
        <p className="font-body text-text-light text-sm mb-3">{address}</p>
        <div className="flex items-center">
          <StarRating rating={rating} />
          <span className="text-text-light text-sm ml-2">
            {reviewCount} {t("listingCard.reviews")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
