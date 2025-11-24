"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/Button";
import {
  FaCheckCircle,
  FaArrowLeft,
  FaSpinner,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { getSubscriptionPlanById, subscribe, getPaymentStatus } from "../api";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const planId = searchParams.get("plan") || location.state?.plan?.id;

  const [plan, setPlan] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    const getPlanDetails = async () => {
      try {
        setFetching(true);
        const { data } = await getSubscriptionPlanById(planId);
        setPlan(data?.data);
      } catch (err) {
        console.error("Failed to fetch plan:", err);
        setError(
          "Failed to load plan details. The server might be unavailable."
        );
      } finally {
        setFetching(false);
      }
    };

    getPlanDetails();
  }, [planId]);

  useEffect(() => {
    if (!isPaymentInitiated || !paymentId) return;

    let pollTimeout;
    const pollPaymentStatus = async () => {
      try {
        const response = await getPaymentStatus(paymentId);
        const status = response.data?.data?.status;

        if (["Completed", "Failed", "Cancelled"].includes(status)) {
          setPaymentStatus(status);
        } else {
          pollTimeout = setTimeout(pollPaymentStatus, 5000);
        }
      } catch (err) {
        console.error("Error polling payment status:", err);
        pollTimeout = setTimeout(pollPaymentStatus, 5000);
      }
    };

    pollPaymentStatus();

    return () => {
      if (pollTimeout) clearTimeout(pollTimeout);
    };
  }, [isPaymentInitiated, paymentId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setIsPaymentInitiated(true);
      const subscribeData = {
        planId: planId,
      };
      const response = await subscribe(subscribeData);

      const newPaymentId = response.data?.data?.paymentReference;
      setPaymentId(newPaymentId);
      toast.info("Payment processing...");
      window.open(response?.data?.data?.paymentUrl, "_blank");
    } catch (err) {
      toast.error("Payment initiation failed. Please try again.");
      setLoading(false);
      setIsPaymentInitiated(false);
    }
  };

  const handleStatusModalAction = () => {
    if (paymentStatus === "Success") {
      navigate("/salon-owner/dashboard");
    } else {
      setPaymentStatus(null);
      setIsPaymentInitiated(false);
      setPaymentId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-purple hover:text-primary-pink mb-8 font-semibold transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        {fetching ? (
          <div className="text-center py-20">
            <FaSpinner className="text-5xl text-primary-purple mx-auto animate-spin" />
            <p className="mt-4 font-semibold text-text-muted">
              Loading plan details...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600 bg-red-50 p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">An Error Occurred</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-8">Order Summary</h1>

            {/* Plan Details */}
            <div className="mb-8 pb-8 border-b">
              <h2 className="font-semibold text-xl mb-1">
                {plan?.planName} Plan
              </h2>
              <h4 className="font-semibold text-md mb-6 text-gray-600">
                {plan?.description}
              </h4>
              <ul className="space-y-3">
                {plan?.planSpecs?.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-4 mb-8 pb-8 border-b">
              <div className="flex justify-between text-gray-600">
                <span>Monthly Subscription</span>
                <span className="font-semibold">
                  {plan?.currency} {plan?.amount}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Setup Fee</span>
                <span className="font-semibold">{plan?.currency} 0</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-semibold">{plan?.currency} 0</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold">Total (Monthly)</span>
              <span className="text-4xl font-bold text-primary-purple">
                {plan?.currency} {plan?.amount}
              </span>
            </div>

            {/* Terms */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
              <p className="text-sm text-gray-700">
                By clicking "Pay Now", you will be redirected to our payment
                provider to complete the transaction securely. Your subscription
                to the <strong>{plan?.planName} Plan</strong> at{" "}
                <strong>
                  {plan?.currency} {plan?.amount}/month
                </strong>{" "}
                will begin immediately after payment. You can cancel anytime.
              </p>
            </div>

            <Button
              variant="gradient"
              onClick={handlePayment}
              disabled={loading || isPaymentInitiated}
              className="w-full !py-3 text-lg"
            >
              {isPaymentInitiated
                ? "Processing..."
                : `Pay Now - ${plan?.currency} ${plan?.amount}/month`}
            </Button>

            {/* Security Notice */}
            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Payments are processed securely by our trusted payment provider
            </p>
          </div>
        )}
      </div>

      {isPaymentInitiated && !paymentStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <FaSpinner className="text-5xl text-primary-purple mx-auto animate-spin mb-4" />
            <h2 className="text-xl font-bold mb-2">Processing Payment</h2>
            <p className="text-gray-600">
              Please wait while we process your payment...
            </p>
          </div>
        </div>
      )}

      {paymentStatus === "Success" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your subscription to the {plan?.planName} Plan has been activated.
              You will be redirected to your dashboard.
            </p>
            <Button
              variant="gradient"
              onClick={handleStatusModalAction}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}

      {paymentStatus === "Failed" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
            <FaExclamationCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              Your payment could not be processed. Please check your payment
              details and try again.
            </p>
            <Button
              variant="gradient"
              onClick={handleStatusModalAction}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {paymentStatus === "Cancelled" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
            <FaTimesCircle className="text-6xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Cancelled</h2>
            <p className="text-gray-600 mb-6">
              Your payment was cancelled. No charges have been made to your
              account.
            </p>
            <Button
              variant="gradient"
              onClick={handleStatusModalAction}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
