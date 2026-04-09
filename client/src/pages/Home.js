import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSalons } from "../api/swr";
import SalonCard from "../components/SalonCard";
import SalonSearchBar from "../components/SalonSearchBar";
import { FaArrowRight, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import Button from "../components/Button";

const HomePage = () => {
  const { t } = useTranslation();
  
  // We call the API. It now returns { salons, pages, totalSalons }
  const {
    data: salonsData,
    isLoading: loading,
    error,
    mutate
  } = useSalons(1); // Fetch page 1 for the home page

  // Extract the salons array safely
  const salons = salonsData?.salons || [];

  return (
    <div className="bg-white">
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

          {loading ? (
            <div className="text-center py-20">
              <FaSpinner className="text-5xl text-primary-purple mx-auto animate-spin" />
              <p className="mt-4 font-semibold text-text-muted">
                {t("homePage.featuredSalons.loading")}
              </p>
            </div>
          ) : error ? (
            /* BOSS REQUIREMENT: FIX ERROR HANDLING */
            <div className="text-center py-16 bg-red-50 border border-red-100 rounded-[2.5rem] max-w-2xl mx-auto shadow-sm p-10">
              <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
              <h3 className="font-black text-2xl text-red-700">
                Server Connection Timeout
              </h3>
              <p className="text-red-600 mt-2">The system is taking a bit long to wake up. Please try again.</p>
              <button 
                onClick={() => mutate()} 
                className="mt-6 px-10 py-3 bg-red-600 text-white rounded-full font-black shadow-lg hover:bg-red-700 transition-all"
              >
                Retry Loading
              </button>
            </div>
          ) : salons.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 p-8 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg">{t("homePage.featuredSalons.noSalonsTitle")}</h3>
              <p className="text-text-muted">{t("homePage.featuredSalons.noSalonsDescription")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* SHUFFLE & LIMIT TO 6 FOR PERFORMANCE */}
              {salons
                .slice()
                .sort(() => 0.5 - Math.random())
                .slice(0, 6)
                .map((salon) => (
                  <SalonCard key={salon._id} salon={salon} />
                ))}
            </div>
          )}

          {!loading && salons.length > 0 && (
            <div className="mt-16 text-center">
              <Link to="/salons">
                <Button variant="gradient" className="px-8 py-3 flex flex-row items-center justify-center mx-auto">
                  {t("homePage.featuredSalons.viewAll")} <FaArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary-purple to-primary-pink py-16 px-4 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{t("homePage.ctaSalonOwners.title")}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{t("homePage.ctaSalonOwners.description")}</p>
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