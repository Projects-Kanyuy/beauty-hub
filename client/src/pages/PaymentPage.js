"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaTimesCircle,
  FaGlobe,
  FaTicketAlt,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getPaymentStatus,
  getSubscriptionPlanById,
  redeemCouponCode,
  subscribe,
  getSwychrRate,
} from "../api";
import Button from "../components/Button";

// Swychr Supported Regional Mapping
const SUPPORTED_REGIONS = [
  { name: "Cameroon", code: "CM", currency: "XAF" },
  { name: "Nigeria", code: "NG", currency: "NGN" },
  { name: "Ghana", code: "GH", currency: "GHS" },
  { name: "Cote d'Ivoire", code: "CI", currency: "XAF" },
  { name: "Other (International USD)", code: "US", currency: "USD" },
];

const PaymentPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const planId = searchParams.get("plan") || location.state?.plan?.id;

  // Plan & UI States
  const [plan, setPlan] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Multi-Currency States
  const [selectedRegion, setSelectedRegion] = useState(SUPPORTED_REGIONS[0]);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [fetchingRate, setFetchingRate] = useState(false);

  // Payment Tracking States
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState("");

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [redeemingCoupon, setRedeemingCoupon] = useState(false);

  // 1. Fetch Plan Details on Mount
  useEffect(() => {
    const getPlanDetails = async () => {
      if (!planId) {
        setError("No plan selected");
        setFetching(false);
        return;
      }
      try {
        setFetching(true);
        const { data } = await getSubscriptionPlanById(planId);
        setPlan(data?.data);
      } catch (err) {
        console.error("Failed to fetch plan:", err);
        setError(t("payment.errorLoadingPlan"));
      } finally {
        setFetching(false);
      }
    };
    getPlanDetails();
  }, [planId, t]);

  // 2. Fetch Swychr Conversion Rate when Region Changes
  useEffect(() => {
 const fetchRate = async () => {
  try {
    setFetchingRate(true);
    const response = await getSwychrRate(selectedRegion.code);
    
    // If the backend is fixed, response.data.rate will be 12 (for GH)
    if (response.data && response.data.success) {
      setExchangeRate(response.data.rate); 
    }
  } catch (err) {
    // Only use 615 as a last resort if the internet is down
    setExchangeRate(615); 
  } finally {
    setFetchingRate(false);
  }
};
    if (plan) fetchRate();
  }, [selectedRegion, plan]);

  // 3. Poll Payment Status after initiation
  useEffect(() => {
    if (!isPaymentInitiated || !paymentId || paymentStatus) return;

    const interval = setInterval(async () => {
      try {
        const response = await getPaymentStatus(paymentId);
        const status = response.data?.data?.status; // Status from Swychr: PENDING, PAID, FAILED

        if (status === "PAID" || status === "Completed") {
          setPaymentStatus("Completed");
          clearInterval(interval);
        } else if (status === "FAILED" || status === "Failed") {
          setPaymentStatus("Failed");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaymentInitiated, paymentId, paymentStatus]);

  // 4. Calculate Display Amount
  const localAmount = Math.ceil((plan?.amount || 0) * exchangeRate);

  // 5. Main Payment Logic
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Handle Free Coupons first
      if (couponCode.trim().toUpperCase().startsWith("FREE")) {
        setRedeemingCoupon(true);
        await redeemCouponCode({ code: couponCode.trim() });
        toast.success(t("payment.subscriptionFree"));
        navigate("/salon-owner/dashboard");
        return;
      }

      // Initiate Swychr Subscription
      const subscribeData = { 
        planId, 
        countryCode: selectedRegion.code, 
        currency: selectedRegion.currency 
      };

      const response = await subscribe(subscribeData);
      
      const pUrl = response.data?.data?.paymentUrl;
      const pRef = response.data?.data?.paymentReference;

      if (pUrl) {
        setPaymentId(pRef);
        setPaymentUrl(pUrl);
        setIsPaymentInitiated(true);
        window.open(pUrl, "_blank"); // Open Swychr Checkout
        toast.info(t("payment.paymentProcessing"));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("payment.paymentFailedInitiate"));
    } finally {
      setLoading(false);
      setRedeemingCoupon(false);
    }
  };

  const closeModal = () => {
    if (paymentStatus === "Completed") {
      navigate("/salon-owner/dashboard");
    } else {
      setIsPaymentInitiated(false);
      setPaymentStatus(null);
    }
  };

  if (fetching) return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-4xl text-primary-purple" /></div>;

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-black mb-8 transition-all">
          <FaArrowLeft className="mr-2" /> {t("payment.back")}
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden p-8 md:p-12 border border-white">
          <h1 className="text-3xl font-bold mb-2">{t("payment.orderSummary")}</h1>
          <p className="text-gray-400 mb-10">Review your plan and select payment region.</p>

          {/* Plan Details Card */}
          <div className="bg-[#F5F5F7] rounded-3xl p-6 mb-8">
            <h2 className="text-xl font-bold text-primary-purple">{plan?.planName} Plan</h2>
            <p className="text-gray-600 mt-1 mb-4">{plan?.description}</p>
            <ul className="space-y-3">
              {plan?.planSpecs?.map((spec, i) => (
                <li key={i} className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" /> {spec}
                </li>
              ))}
            </ul>
          </div>

          {/* Region Selector */}
          <div className="mb-10">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4 tracking-wide uppercase">
              <FaGlobe className="text-blue-500" /> Payment Region
            </label>
            <div className="grid grid-cols-1 gap-3">
              {SUPPORTED_REGIONS.map((region) => (
                <div 
                  key={region.code}
                  onClick={() => setSelectedRegion(region)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedRegion.code === region.code ? 'border-primary-purple bg-purple-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className="font-bold text-gray-700">{region.name}</span>
                  <span className="text-xs font-black text-gray-400 uppercase">{region.currency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Logic */}
          <div className="space-y-4 mb-10 py-6 border-y border-gray-100">
            <div className="flex justify-between text-gray-500">
              <span>Standard Price</span>
              <span className="font-medium">$ {plan?.amount} / mo</span>
            </div>
            <div className="flex justify-between items-center text-black">
              <span className="text-lg font-bold">Total Payable</span>
              <div className="text-right">
                {fetchingRate ? (
                  <FaSpinner className="animate-spin ml-auto" />
                ) : (
                  <>
                    <span className="text-4xl font-black text-primary-purple">
                      {selectedRegion.currency} {localAmount}
                    </span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Swychr Live Exchange Rate Applied</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Coupon Input */}
          <div className="mb-10">
            <div className="relative">
              <FaTicketAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Promo or Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none transition-all"
              />
            </div>
          </div>

          <Button
            variant="gradient"
            onClick={handlePayment}
            disabled={loading || fetchingRate || isPaymentInitiated}
            className="w-full !py-5 text-xl rounded-full shadow-lg flex items-center justify-center gap-3"
          >
            {loading && <FaSpinner className="animate-spin" />}
            {isPaymentInitiated ? "Awaiting Payment..." : `Pay Now - ${selectedRegion.currency} ${localAmount}`}
          </Button>
        </div>
      </div>

      {/* MODALS */}
      {isPaymentInitiated && !paymentStatus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-6">
          <div className="bg-white p-10 rounded-[3rem] text-center max-w-sm w-full">
            <FaSpinner className="text-6xl text-primary-purple animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Processing Payment</h2>
            <p className="text-gray-500 mb-8 leading-relaxed text-sm">Please complete the transaction in the new window. This page will update automatically once finished.</p>
            <a href={paymentUrl} target="_blank" rel="noreferrer" className="text-primary-purple font-bold underline">Re-open payment link</a>
          </div>
        </div>
      )}

      {paymentStatus === "Completed" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-6">
          <div className="bg-white p-10 rounded-[3rem] text-center max-w-sm w-full shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-black tracking-tight">Success!</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">Your {plan?.planName} subscription is now active.</p>
            <Button variant="gradient" onClick={closeModal} className="w-full">Go to Dashboard</Button>
          </div>
        </div>
      )}

      {(paymentStatus === "Failed" || paymentStatus === "Cancelled") && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-6">
          <div className="bg-white p-10 rounded-[3rem] text-center max-w-sm w-full shadow-2xl">
            <FaExclamationCircle className="text-6xl text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">We couldn't verify your payment. Please try again or contact support.</p>
            <Button variant="gradient" onClick={closeModal} className="w-full">Try Again</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;