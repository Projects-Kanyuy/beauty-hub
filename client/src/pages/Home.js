import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSalons } from "../api/swr";
import SalonCard from "../components/SalonCard";
import SalonSearchBar from "../components/SalonSearchBar";

import { FaArrowRight, FaSpinner } from "react-icons/fa";
// import { BsChatDots } from "react-icons/bs";
import Button from "../components/Button";

const HomePage = () => {
  const { t } = useTranslation();
  const {
    data: salons = [],
    isLoading: loading,
    error,
  } = useSalons();

  return (
    <div className="bg-white">
      {/* Salons Grid Section */}
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <SalonSearchBar />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-text-main mb-2">
                {t("homePage.featuredSalons.title")}
              </h2>
              <p className="text-lg text-text-muted">
                {t("homePage.featuredSalons.description")}
              </p>
            </div>
            <Link
              to="/salons"
              className="mt-4 md:mt-0 flex items-center text-primary-purple hover:text-primary-pink transition-colors font-semibold"
            >
              {t("homePage.featuredSalons.viewAll")}{" "}
              <FaArrowRight className="ml-2" />
            </Link>
          </div>

          {/* Loading/Error/Content States */}
          {loading ? (
            <div className="text-center py-20">
              <FaSpinner className="text-5xl text-primary-purple mx-auto animate-spin" />
              <p className="mt-4 font-semibold text-text-muted">
                {t("homePage.featuredSalons.loading")}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600 bg-red-50 p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg">
                {t("homePage.featuredSalons.errorTitle")}
              </h3>
              <p>{t("homePage.featuredSalons.errorMessage")}</p>
            </div>
          ) : salons.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 p-8 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg">
                {t("homePage.featuredSalons.noSalonsTitle")}
              </h3>
              <p className="text-text-muted">
                {t("homePage.featuredSalons.noSalonsDescription")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* --- SHUFFLE LOGIC APPLIED HERE --- */}
              {salons
                .slice() // 1. Make a copy of the array
                .sort(() => 0.5 - Math.random()) // 2. Randomly sort the copy
                .slice(0, 6) // 3. Take only the first 6 after shuffling
                .map((salon) => (
                  <SalonCard key={salon._id} salon={salon} />
                ))}
            </div>
          )}

          {/* CTA Section */}
          {!loading && salons.length > 0 && (
            <div className="mt-16 text-center">
              <Link to="/salons">
                <Button
                  variant="gradient"
                  className="px-8 py-3 flex flex-row items-center justify-center mx-auto"
                >
                  {t("homePage.featuredSalons.viewAll")}{" "}
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA for Salon Owners */}
      <section className="bg-gradient-to-r from-primary-purple to-primary-pink py-16 px-4 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t("homePage.ctaSalonOwners.title")}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t("homePage.ctaSalonOwners.description")}
          </p>
          <Link to="/subscriptions">
            <Button variant="gradient" className="px-8 py-3 flex items-center justify-center mx-auto">
              {t("homePage.ctaSalonOwners.button")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;