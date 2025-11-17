import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { FaCreditCard, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const planId = searchParams.get("plan") || location.state?.plan?.id;

  // Plan details for display
  const planDetails = {
    starter: {
      name: "Starter",
      price: 5,
      features: [
        "Directory listing",
        "Basic analytics",
        "Appointment reminders",
      ],
    },
    standard: {
      name: "Standard",
      price: 10,
      features: ["Everything in Starter", "3x more traffic", "Local campaigns"],
    },
    pro: {
      name: "Pro",
      price: 16,
      features: [
        "Everything in Standard",
        "5x more traffic",
        "Top Rated listing",
      ],
    },
    premium: {
      name: "Premium",
      price: 25,
      features: [
        "Everything in Pro",
        "10x more traffic",
        "Multi-city visibility",
      ],
    },
    elite: {
      name: "Elite",
      price: 50,
      features: [
        "Everything in Premium",
        "20x more traffic",
        "Dedicated support",
      ],
    },
  };

  const plan = planDetails[planId] || planDetails.starter;
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock payment processing - in production, this would call a backend payment API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Payment successful! Activating your subscription...");

      // Redirect to salon dashboard
      setTimeout(() => {
        navigate("/salon-owner/dashboard");
      }, 1500);
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-purple hover:text-primary-pink mb-8 font-semibold transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Order Summary */}
          <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-md h-fit sticky top-4">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Plan Details */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-lg mb-3">{plan.name} Plan</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Subscription</span>
                <span className="font-semibold">${plan.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Setup Fee</span>
                <span className="font-semibold">$0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">$0</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold">Total (Monthly)</span>
              <span className="text-3xl font-bold text-primary-purple">
                ${plan.price}
              </span>
            </div>

            {/* Note */}
            <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              Your subscription will renew automatically each month. You can
              cancel anytime.
            </p>
          </div>

          {/* Right: Payment Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "card", label: "Credit/Debit Card", icon: "💳" },
                  { id: "momo", label: "MTN MoMo", icon: "📱" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === method.id
                        ? "border-primary-purple bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="font-semibold text-sm">{method.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === "card" && (
              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardData.cardName}
                    onChange={(e) =>
                      setCardData({ ...cardData, cardName: e.target.value })
                    }
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) =>
                      setCardData({ ...cardData, cardNumber: e.target.value })
                    }
                    placeholder="4111 1111 1111 1111"
                    maxLength="19"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardData.expiryDate}
                      onChange={(e) =>
                        setCardData({ ...cardData, expiryDate: e.target.value })
                      }
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) =>
                        setCardData({ ...cardData, cvv: e.target.value })
                      }
                      placeholder="123"
                      maxLength="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                      required
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    By clicking "Complete Payment", you agree to subscribe to
                    the <strong>{plan.name} Plan</strong> at{" "}
                    <strong>${plan.price}/month</strong>. You can cancel
                    anytime.
                  </p>
                </div>

                <Button
                  variant="gradient"
                  type="submit"
                  disabled={loading}
                  className="w-full !py-3"
                >
                  {loading
                    ? "Processing Payment..."
                    : `Complete Payment - $${plan.price}`}
                </Button>
              </form>
            )}

            {/* MoMo Payment */}
            {paymentMethod === "momo" && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="font-bold mb-2">MTN MoMo Payment</h3>
                  <p className="text-gray-600 mb-6">
                    To complete your payment, dial <strong>*156#</strong> on
                    your MTN line and follow the prompts.
                  </p>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded mb-6">
                    Amount: <strong>${plan.price}</strong>
                  </p>
                  <form onSubmit={handlePayment} className="space-y-4">
                    <input
                      type="tel"
                      placeholder="Enter your MTN phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                      required
                    />
                    <Button
                      variant="gradient"
                      type="submit"
                      disabled={loading}
                      className="w-full !py-3"
                    >
                      {loading ? "Processing..." : "Confirm Payment"}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
