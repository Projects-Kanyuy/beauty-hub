import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";
import SalonCard from "../components/SalonCard";
import { mockSalons } from "../data/mockData";

const NearMePage = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching location and data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Pretend it takes 1.5 seconds to find location
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-text-main">
            {t("nearMe.title")}
          </h1>
          <p className="text-lg text-text-muted mt-4">
            {t("nearMe.description")}
          </p>
        </div>

        {isLoading ? (
          // Show a loading spinner while "finding" location
          <div className="text-center p-12">
            <FaSpinner className="text-5xl text-primary-purple mx-auto animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-text-main">
              {t("nearMe.loading")}
            </h2>
          </div>
        ) : (
          // Once loaded, show the salon grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearMePage;
