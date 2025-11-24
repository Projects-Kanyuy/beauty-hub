import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaCheckCircle,
  FaHeart,
  FaStore,
  FaMapMarkerAlt,
  FaSpinner,
} from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { MdAnalytics } from "react-icons/md";
import heroBg from "../assets/hero-main-bg.jpg";
import { listSubscriptionPlans } from "../api";

const Subscriptions = () => {
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
        console.error("Failed to fetch salons:", err);
        setError("Failed to load salons. The server might be unavailable.");
      } finally {
        setLoading(false);
      }
    };

    getSubscriptions();
  }, []);

  console.log({ subscriptions });

  const [selectedPlan, setSelectedPlan] = useState();

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan._id);

    if (user) {
      // Returning user - go directly to payment
      navigate(`/payment?plan=${plan._id}`, { state: { plan } });
    } else {
      // New user - go to register first
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
            Grow Your Beauty Business with BeautyHeaven
          </h1>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            Choose the perfect plan for your salon and start attracting more
            customers today.
          </p>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="container mx-auto px-6 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Start with any plan and upgrade anytime as your business grows.
          </p>
        </div>

        {/* Loading/Error/Content States */}
        {loading ? (
          <div className="text-center py-20">
            <FaSpinner className="text-5xl text-primary-purple mx-auto animate-spin" />
            <p className="mt-4 font-semibold text-text-muted">
              Loading plans...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600 bg-red-50 p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">An Error Occurred</h3>
            <p>{error}</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 p-8 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">No subscription plan Found</h3>
            <p className="text-text-muted">
              There are currently no subscription plans. Contact an admin to add
              one
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                      Most Popular
                    </span>
                  )}
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      selectedPlan === plan._id ? "text-white" : "text-text-main"
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
                      selectedPlan === plan._id ? "text-white" : "text-text-main"
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
                      /Month
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
                      selectedPlan === plan._id
                        ? "bg-gradient-to-r from-primary-pink to-primary-purple text-white hover:shadow-lg"
                        : "bg-gray-100 text-text-main hover:bg-gray-200"
                    }`}
                  >
                    Choose Plan
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
            Why Salon Owners Choose BeautyHeaven
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <FaStore className="text-5xl text-primary-pink mb-4" />
              <h3 className="text-xl font-bold mb-2">Manage Your Salon</h3>
              <p className="text-gray-600">
                Complete profile, services, and appointment management in one
                place.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <MdAnalytics className="text-5xl text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-gray-600">
                Track bookings, customer behavior, and grow your business with
                data.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaMapMarkerAlt className="text-5xl text-primary-pink mb-4" />
              <h3 className="text-xl font-bold mb-2">Get Discovered</h3>
              <p className="text-gray-600">
                Higher visibility means more local customers finding your
                business.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <BsChatDots className="text-5xl text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-2">Direct Chat</h3>
              <p className="text-gray-600">
                Communicate directly with customers and build relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ or Support Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">
              Can I change my plan later?
            </h3>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan anytime. Changes take
              effect at the next billing cycle.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">
              Do you offer a free trial?
            </h3>
            <p className="text-gray-600">
              Yes, new salon owners get a 7-day free trial to explore all
              features before committing.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600">
              We accept credit cards, debit cards, and local payment methods
              like MTN MoMo and Orange Money.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscriptions;
