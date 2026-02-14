import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsChatDots } from "react-icons/bs";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaSpinner,
  FaStore,
} from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSubscriptionPlans } from "../api/swr";
import heroBg from "../assets/hero-background.jpg";
import { useAuth } from "../context/AuthContext";

const Subscriptions = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: subscriptions = [],
    isLoading: loading,
    error,
  } = useSubscriptionPlans();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan._id);
    if (user) {
      navigate(`/payment?plan=${plan._id}`, { state: { plan } });
    } else {
      navigate(`/register?plan=${plan._id}`, { state: { plan } });
    }
  };

  return (
    <div className="bg-white font-sans relative">
      {/* Hero Section */}
      <section
        className="relative text-center pt-16 pb-48 md:pt-20 md:pb-56 px-4 overflow-hidden -mt-10"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-3xl mx-auto" />
      </section>

      {/* Pricing Plans Overlapping Hero */}
      <section className="container mx-auto px-4 md:px-6 -mt-52 relative z-20">
        {loading ? (
          <div className="text-center py-20">
            <FaSpinner className="text-5xl text-primary-purple mx-auto animate-spin" />
            <p className="mt-4 font-semibold text-text-muted">
              {t("subscriptions.loading")}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-700 bg-red-50 p-6 rounded-2xl shadow-xl">
            <h3 className="font-bold text-lg">
              {t("subscriptions.errorTitle")}
            </h3>
            <p>{t("subscriptions.fetchError")}</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 p-8 rounded-2xl shadow-xl">
            <h3 className="font-bold text-lg">
              {t("subscriptions.noPlansTitle")}
            </h3>
            <p className="text-text-muted">{t("subscriptions.noPlansDesc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptions.map((plan) => (
              <div
                key={plan._id}
                onClick={() => handleSelectPlan(plan)}
                className={`bg-white border rounded-3xl p-6 flex flex-col cursor-pointer transition-transform duration-300 shadow-lg hover:scale-105
                  ${
                    selectedPlan === plan._id
                      ? "ring-2 ring-primary-purple scale-105 shadow-2xl"
                      : ""
                  }
                `}
              >
                {/* Header */}
                <div
                  className={`mb-4 ${
                    selectedPlan === plan._id ? "text-white" : ""
                  }`}
                >
                  {plan.popular && (
                    <span className="inline-block bg-primary-purple text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
                      {t("subscriptions.mostPopular")}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold mb-1">{plan.planName}</h3>
                  <p
                    className={`text-sm ${
                      selectedPlan === plan._id
                        ? "text-pink-100"
                        : "text-text-muted"
                    }`}
                  >
                    {plan.description}
                  </p>
                  <div className="flex items-baseline mt-3">
                    <span className="text-4xl font-bold">
                      <span className="text-xl">{plan.currency}</span>{" "}
                      {plan.amount}
                    </span>
                    <span
                      className={`ml-1 ${
                        selectedPlan === plan._id
                          ? "text-pink-100"
                          : "text-text-muted"
                      }`}
                    >
                      /{t("subscriptions.perMonth")}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-grow text-gray-700 text-sm">
                  {plan.planSpecs.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle
                        className={`text-green-500 ${
                          selectedPlan === plan._id ? "text-primary-pink" : ""
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Footer Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`mt-6 w-full py-3 rounded-2xl font-semibold transition-all ${
                    selectedPlan === plan._id
                      ? "bg-gradient-to-r from-primary-pink to-primary-purple text-white hover:shadow-xl"
                      : "bg-gray-100 text-text-main hover:bg-gray-200"
                  }`}
                >
                  {t("subscriptions.choosePlan")}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Comparison */}
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-2">
                {t(`subscriptions.faq${i}Question`)}
              </h3>
              <p className="text-gray-600">
                {t(`subscriptions.faq${i}Answer`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Subscriptions;
