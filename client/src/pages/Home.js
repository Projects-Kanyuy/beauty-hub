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
      {/* Hero Section */}
      {/* <section className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Discover & Book Beauty Services Locally
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Connect with verified salons and beauty professionals in your area.
            Book appointments with ease and chat directly with service
            providers.
          </p>

          <div className="grid grid-cols-3 gap-6 text-center mt-16">
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <p className="text-slate-400">Salons Listed</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <p className="text-slate-400">Happy Customers</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">10+</div>
              <p className="text-slate-400">Countries</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Featured Benefits Section */}
      {/* <section className="bg-slate-50 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose BeautyHeaven
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <FaShieldAlt className="text-4xl text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-3">Verified Salons</h3>
              <p className="text-gray-600">
                All salons are verified and authenticated for your peace of
                mind.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <FaMapMarkerAlt className="text-4xl text-primary-pink mb-4" />
              <h3 className="text-xl font-bold mb-3">Find Nearby</h3>
              <p className="text-gray-600">
                Discover salons near you with real-time availability and instant
                booking.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <BsChatDots className="text-4xl text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-3">Direct Chat</h3>
              <p className="text-gray-600">
                Chat directly with salon owners to discuss services and special
                requests.
              </p>
            </div>
          </div>
        </div>
      </section> */}

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
              {salons.slice(0, 6).map((salon) => (
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
                  className="px-8 py-3 flex flex-row items-center justify-center"
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
            <Button variant="light" className="px-8 py-3">
              {t("homePage.ctaSalonOwners.button")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
