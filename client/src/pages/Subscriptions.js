import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaCheckCircle,
  FaHeart,
  FaStore,
  FaRocket,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BsChatDots, BsCalendarCheck } from "react-icons/bs";
import { MdAnalytics, MdRateReview } from "react-icons/md";
import Button from "../components/Button";
import heroBg from "../assets/hero-main-bg.jpg";

const Subscriptions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 5,
      period: "month",
      description: "Ideal for small beauty service providers starting out.",
      features: [
        "Targeted traffic from nearby customers",
        "Visible on BeautyHeavenven directory",
        "Appointment reminders",
        "Basic analytics",
        "Simple client loyalty tracker",
        "Appointment calendar integration",
        "Auto-generated receipts",
        "Mini social wall",
      ],
      highlighted: false,
    },
    {
      id: "standard",
      name: "Standard",
      price: 10,
      period: "month",
      description:
        "Perfect for growing beauty businesses seeking more visibility.",
      features: [
        "Everything in Starter, plus:",
        "3× more customer traffic",
        "Local promotion campaigns",
        "Priority listing",
        "Automated follow-up reminders",
        "Enhanced loyalty tracker",
        "Google Calendar sync",
        "Extended analytics dashboard",
      ],
      highlighted: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 16,
      period: "month",
      description:
        "For active salons and spas that want to dominate local search.",
      features: [
        "Everything in Standard, plus:",
        "5× more targeted traffic",
        "Top Rated section listing",
        "WhatsApp broadcast marketing",
        "Advanced performance dashboard",
        "Enhanced social wall",
        "Customer review highlights",
      ],
      highlighted: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: 25,
      period: "month",
      description: "Ideal for multi-branch beauty brands or professionals.",
      features: [
        "Everything in Pro, plus:",
        "10× more customer traffic",
        "Featured visibility across cities",
        "Priority mobile app integration",
        "Monthly performance reports",
        "Automated rebooking system",
        "Featured promotions showcase",
      ],
      highlighted: false,
    },
    {
      id: "elite",
      name: "Elite",
      price: 50,
      period: "month",
      description:
        "For nationwide or international beauty brands aiming to dominate.",
      features: [
        "Everything in Premium, plus:",
        "20x more targeted traffic",
        "Sponsored homepage visibility",
        "Unlimited client reminders",
        "Unlimited bulk promotions",
        "Dedicated support channel",
        "Priority placement in all searches",
      ],
      highlighted: false,
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan.id);

    if (user) {
      // Returning user - go directly to payment
      navigate(`/payment?plan=${plan.id}`, { state: { plan } });
    } else {
      // New user - go to register first
      navigate(`/register?plan=${plan.id}`, { state: { plan } });
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 flex flex-col cursor-pointer ${
                selectedPlan === plan.id
                  ? "ring-2 ring-primary-pink scale-105 md:scale-110 lg:scale-100"
                  : "hover:shadow-lg"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Card Header */}
              <div
                className={`p-6 ${
                  selectedPlan === plan.id
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
                    selectedPlan === plan.id ? "text-white" : "text-text-main"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    selectedPlan === plan.id
                      ? "text-pink-100"
                      : "text-text-muted"
                  }`}
                >
                  {plan.description}
                </p>
                <div
                  className={`flex items-baseline ${
                    selectedPlan === plan.id ? "text-white" : "text-text-main"
                  }`}
                >
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span
                    className={`ml-2 ${
                      selectedPlan === plan.id
                        ? "text-pink-100"
                        : "text-text-muted"
                    }`}
                  >
                    /{plan.period}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow bg-white">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
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
                            selectedPlan === plan.id
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
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>
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
