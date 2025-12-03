import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsChatDots } from "react-icons/bs";
import {
  FaCheckCircle,
  FaHeart,
  FaMapMarkerAlt,
  FaSpinner,
  FaStore,
} from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { listSubscriptionPlans } from "../api";
import heroBg from "../assets/hero-main-bg.jpg";
import { useAuth } from "../context/AuthContext";

const Subscriptions = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        setLoading(true);
        const { data } = await listSubscriptionPlans();
        setSubscriptions(data);
      } catch (err) {
        console.error("Failed to fetch subscriptions:", err);
        setError(t("subscriptions.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    getSubscriptions();
  }, []);

  const [selectedPlan, setSelectedPlan] = useState();

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan._id);

    if (user) {
      navigate(`/payment?plan=${plan._id}`, { state: { plan } });
    } else {
      navigate(`/register?plan=${plan._id}`, { state: { plan } });
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative text-center py-10 md:py-16 px-4"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white opacity-60"></div>
        <div className="relative z-10">
          <div className="flex justify-center items-center mb-4">
            <span className="text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-pink to-primary-purple text-transparent bg-clip-text">
              BeautyHeaven
            </span>
            <FaHeart className="text-pink-400 text-4xl ml-2" />
          </div>
          <h1 className="text-xl md:text-5xl font-bold text-text-main mb-4">
            {t("subscriptions.heroTitle")}
          </h1>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            {t("subscriptions.heroDesc")}
          </p>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="container mx-auto px-6 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {t("subscriptions.pricingTitle")}
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {t("subscriptions.pricingDesc")}
          </p>
        </div>
        <div className="text-center mb-8 md:mb-12">
          <p className="mt-2 text-2xl text-gray-600">
            🎁 {t("subscriptions.freeCoupon")}{" "}
            <strong className="text-primary-purple">ADD-0NCJ-ENH2</strong>
          </p>
        </div>

        {/* Loading/Error/Content States */}
        {loading ? (
          <div className="text-center py-20">
            <FaSpinner className="text-5xl text-primary-purple mx-auto animate-spin" />
            <p className="mt-4 font-semibold text-text-muted">
              {t("subscriptions.loading")}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600 bg-red-50 p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">
              {t("subscriptions.errorTitle")}
            </h3>
            <p>{error}</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 p-8 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">
              {t("subscriptions.noPlansTitle")}
            </h3>
            <p className="text-text-muted">{t("subscriptions.noPlansDesc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((plan) => (
              <div
                key={plan._id}
                className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 flex flex-col cursor-pointer ${
                  selectedPlan === plan._id
                    ? "ring-2 ring-primary-pink scale-105 md:scale-110 lg:scale-100"
                    : "hover:shadow-lg"
                }`}
                onClick={() => setSelectedPlan(plan._id)}
              >
                {/* Card Header */}
                <div
                  className={`p-6 ${
                    selectedPlan === plan._id
                      ? "bg-gradient-to-r from-primary-pink to-primary-purple text-white"
                      : "bg-gray-50"
                  }`}
                >
                  {selectedPlan === "pro" && (
                    <span className="inline-block bg-white text-primary-pink px-3 py-1 rounded-full text-sm font-bold mb-3">
                      {t("subscriptions.mostPopular")}
                    </span>
                  )}
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      selectedPlan === plan._id
                        ? "text-white"
                        : "text-text-main"
                    }`}
                  >
                    {plan.planName}
                  </h3>
                  <p
                    className={`text-sm mb-4 ${
                      selectedPlan === plan._id
                        ? "text-pink-100"
                        : "text-text-muted"
                    }`}
                  >
                    {plan.description}
                  </p>
                  <div
                    className={`flex items-baseline ${
                      selectedPlan === plan._id
                        ? "text-white"
                        : "text-text-main"
                    }`}
                  >
                    <span className="text-4xl font-bold">
                      <span className="text-xl">{plan.currency}</span>{" "}
                      {plan.amount}
                    </span>
                    <span
                      className={`ml-2 ${
                        selectedPlan === plan._id
                          ? "text-pink-100"
                          : "text-text-muted"
                      }`}
                    >
                      /{t("subscriptions.perMonth")}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-grow bg-white">
                  <ul className="space-y-3 mb-6">
                    {plan.planSpecs.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start text-sm ${
                          idx === 0 && feature.includes("Everything")
                            ? "font-bold text-gray-700 mb-3"
                            : "text-gray-600"
                        }`}
                      >
                        {!feature.includes("Everything") && (
                          <FaCheckCircle
                            className={`mr-2 mt-0.5 flex-shrink-0 ${
                              selectedPlan === plan._id
                                ? "text-primary-pink"
                                : "text-green-500"
                            }`}
                          />
                        )}
                        {!feature.includes("Everything") ? feature : feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer */}
                <div className="p-6 bg-white border-t">
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      selectedPlan === plan.id
                        ? "bg-gradient-to-r from-primary-pink to-primary-purple text-white hover:shadow-lg"
                        : "bg-gray-100 text-text-main hover:bg-gray-200"
                    }`}
                  >
                    {t("subscriptions.choosePlan")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Comparison Section */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("subscriptions.featuresTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <FaStore className="text-5xl text-primary-pink mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("subscriptions.feature1Title")}
              </h3>
              <p className="text-gray-600">{t("subscriptions.feature1Desc")}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <MdAnalytics className="text-5xl text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("subscriptions.feature2Title")}
              </h3>
              <p className="text-gray-600">{t("subscriptions.feature2Desc")}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaMapMarkerAlt className="text-5xl text-primary-pink mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("subscriptions.feature3Title")}
              </h3>
              <p className="text-gray-600">{t("subscriptions.feature3Desc")}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <BsChatDots className="text-5xl text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("subscriptions.feature4Title")}
              </h3>
              <p className="text-gray-600">{t("subscriptions.feature4Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("subscriptions.faqTitle")}
        </h2>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">
              {t("subscriptions.faq1Question")}
            </h3>
            <p className="text-gray-600">{t("subscriptions.faq1Answer")}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">
              {t("subscriptions.faq2Question")}
            </h3>
            <p className="text-gray-600">{t("subscriptions.faq2Answer")}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">
              {t("subscriptions.faq3Question")}
            </h3>
            <p className="text-gray-600">{t("subscriptions.faq3Answer")}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscriptions;
