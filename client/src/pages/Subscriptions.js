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
import { useNavigate, useLocation } from "react-router-dom";
import { useSubscriptionPlans } from "../api/swr";
import heroBg from "../assets/hero-background.jpg";
import { useAuth } from "../context/AuthContext";

const Subscriptions = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Logic to detect if we are inside the Salon Owner Dashboard
  const isDashboard = location.pathname.includes("salon-owner");

  const {
    data: subscriptions = [],
    isLoading: loading,
    error,
  } = useSubscriptionPlans();

  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan._id);
    if (user) {
      // Stay in portal context when moving to payment
       navigate(`/salon-owner/pay?plan=${plan._id}`, { state: { plan } });
    } else {
      navigate(`/register?plan=${plan._id}`, { state: { plan } });
    }
  };

  return (
    <div className={`bg-white font-sans ${isDashboard ? "min-h-full" : "relative"}`}>
      
      {/* 2. HERO SECTION: Only show if NOT in dashboard */}
      {!isDashboard && (
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
      )}

      {/* 3. MAIN CONTENT AREA */}
      <section className={`container mx-auto px-4 md:px-6 relative z-20 ${isDashboard ? "py-6" : "-mt-52"}`}>
        
        {/* Dashboard-specific Header */}
        {isDashboard && (
          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Upgrade Your Account</h1>
            <p className="text-gray-500 mt-2">Select a plan below to activate your salon profile and start receiving bookings.</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <FaSpinner className="text-5xl text-primary-purple mx-auto animate-spin" />
            <p className="mt-4 font-semibold text-text-muted">{t("subscriptions.loading")}</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-700 bg-red-50 p-6 rounded-2xl shadow-xl">
            <h3 className="font-bold text-lg">{t("subscriptions.errorTitle")}</h3>
            <p>{t("subscriptions.fetchError")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subscriptions.map((plan) => (
              <div
                key={plan._id}
                onClick={() => handleSelectPlan(plan)}
                className={`bg-white border-2 rounded-[2.5rem] p-8 flex flex-col cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1
                  ${selectedPlan === plan._id ? "border-primary-purple ring-4 ring-primary-purple/10" : "border-gray-100"}
                `}
              >
                {/* Plan Header */}
                <div className="mb-6">
                  {plan.planName === "Pro" && (
                    <span className="inline-block bg-primary-purple text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3">
                      {t("subscriptions.mostPopular")}
                    </span>
                  )}
                  {plan.amount === 5 && (
                    <span className="inline-block bg-pink-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3 animate-pulse">
                      Special Offer
                    </span>
                  )}
                  <h3 className="text-3xl font-black text-gray-900">{plan.planName}</h3>
                  
                  <div className="flex items-baseline mt-4">
                    <span className="text-5xl font-black tracking-tighter text-gray-900">
                      <span className="text-2xl mr-1">{plan.currency === 'USD' ? '$' : plan.currency}</span>
                      {plan.amount}
                    </span>
                    <span className="ml-1 text-gray-400 font-bold">/{t("subscriptions.perMonth")}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 flex-grow mb-8">
                  {(plan.planSpecs || []).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 bg-green-100 rounded-full p-0.5">
                        <FaCheckCircle className="text-green-600 text-sm" />
                      </div>
                      <span className="text-gray-600 text-sm font-medium leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan);
                  }}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 ${
                    selectedPlan === plan._id
                      ? "bg-gradient-to-r from-primary-pink to-primary-purple text-white shadow-xl scale-95"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {t("subscriptions.choosePlan")}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. MARKETING CONTENT: Only show if NOT in dashboard */}
      {!isDashboard && (
        <>
          <section className="bg-slate-50 py-24 px-4 mt-20 border-t border-gray-100">
            <div className="container mx-auto">
              <h2 className="text-4xl font-black text-center mb-16 tracking-tight text-gray-900">
                {t("subscriptions.featuresTitle")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6"><FaStore className="text-4xl text-primary-pink" /></div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{t("subscriptions.feature1Title")}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t("subscriptions.feature1Desc")}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6"><MdAnalytics className="text-4xl text-primary-purple" /></div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{t("subscriptions.feature2Title")}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t("subscriptions.feature2Desc")}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6"><FaMapMarkerAlt className="text-4xl text-primary-pink" /></div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{t("subscriptions.feature3Title")}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t("subscriptions.feature3Desc")}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6"><BsChatDots className="text-4xl text-primary-purple" /></div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{t("subscriptions.feature4Title")}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t("subscriptions.feature4Desc")}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 py-24 max-w-4xl">
            <h2 className="text-4xl font-black text-center mb-16 tracking-tight text-gray-900">
              {t("subscriptions.faqTitle")}
            </h2>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-xl mb-3 text-gray-900">{t(`subscriptions.faq${i}Question`)}</h3>
                  <p className="text-gray-500 leading-relaxed">{t(`subscriptions.faq${i}Answer`)}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Subscriptions;