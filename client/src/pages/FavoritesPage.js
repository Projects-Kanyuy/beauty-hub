import { useTranslation } from "react-i18next";
import { FaHeartBroken } from "react-icons/fa";
import { Link } from "react-router-dom";
import SalonCard from "../components/SalonCard";
import { mockSalons, mockUserFavorites } from "../data/mockData";

const FavoritesPage = () => {
  const { t } = useTranslation();
  const favoriteSalons = mockSalons.filter((salon) =>
    mockUserFavorites.includes(salon.id)
  );

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-text-main">
            {t("favoritesPage.title")}
          </h1>
          <p className="text-lg text-text-muted mt-4">
            {t("favoritesPage.description")}
          </p>
        </div>

        {favoriteSalons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <FaHeartBroken className="text-5xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-main">
              {t("favoritesPage.noFavoritesTitle")}
            </h2>
            <p className="text-text-muted mt-2 mb-6">
              {t("favoritesPage.noFavoritesDescription")}
            </p>
            <Link
              to="/"
              className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-primary-pink to-primary-purple hover:opacity-90 transition-opacity"
            >
              {t("favoritesPage.homeButton")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
