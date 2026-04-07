"use client";

import { useEffect, useState } from "react"; 
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaSpinner,
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
  getPlanPrice,
} from "../api";
import Button from "../components/Button";

// Import the Facebook Pixel library
import ReactPixel from "react-facebook-pixel";

const SUPPORTED_REGIONS = [
  { name: "Benin", code: "BJ", currency: "XOF" },
  { name: "Burkina Faso", code: "BF", currency: "XOF" },
  { name: "Cameroon", code: "CM", currency: "XAF" },
  { name: "Congo Brazzaville", code: "CG", currency: "XAF" },
  { name: "Congo DRC", code: "CD", currency: "CDF" },
  { name: "Cote D'Ivoire", code: "CI", currency: "XOF" },
  { name: "Gabon", code: "GA", currency: "XAF" },
  { name: "Guinea Conakry", code: "GN", currency: "GNF" },
  { name: "India", code: "IN", currency: "INR" },
  { name: "Kenya", code: "KE", currency: "KES" },
  { name: "Mali", code: "ML", currency: "XOF" },
  { name: "Nigeria", code: "NG", currency: "NGN" },
  { name: "Senegal", code: "SN", currency: "XOF" },
  { name: "Tanzania", code: "TZ", currency: "TZS" },
  { name: "Togo", code: "TG", currency: "XOF" },
  { name: "Uganda", code: "UG", currency: "UGX" },
  { name: "Zambia", code: "ZM", currency: "ZMW" },
  { name: "International", code: "US", currency: "USD" },
];

const PaymentPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const planId = searchParams.get("plan") || location.state?.plan?.id;

  const [plan, setPlan] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState(SUPPORTED_REGIONS[0]);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [fetchingRate, setFetchingRate] = useState(false);

  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [redeemingCoupon, setRedeemingCoupon] = useState(false);

  // 1. Fetch Plan Details
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
        setError(t("payment.errorLoadingPlan"));
      } finally {
        setFetching(false);
      }
    };
    getPlanDetails();
  }, [planId, t]);

  // 2. Fetch Rate
 useEffect(() => {
  const fetchPrice = async () => {
    if (!plan) return;

    // If International (US), rate is always 1
    if (selectedRegion.code === "US") {
      setExchangeRate(1);
      return;
    }

    try {
      setFetchingRate(true);
      // Call the new backend route
      const response = await getPlanPrice(planId, selectedRegion.code);
      
      if (response.data && response.data.success) {
        // We use the rate returned by the backend (plan.amount * rate)
        setExchangeRate(response.data.data.rate);
      }
    } catch (err) {
      console.error("Failed to fetch live rate, using fallback");
      // Hardcoded fallbacks if API is down
      const fallbacks = { "NG": 1600, "CM": 615, "BF": 615, "KE": 130 };
      setExchangeRate(fallbacks[selectedRegion.code] || 615);
    } finally {
      setFetchingRate(false);
    }
  };

  fetchPrice();
}, [selectedRegion, plan, planId]);

  // 3. Poll Status
  useEffect(() => {
    if (!isPaymentInitiated || !paymentId || paymentStatus) return;

    const interval = setInterval(async () => {
      try {
        const response = await getPaymentStatus(paymentId);
        const status = response.data?.data?.status;
        if (status === "PAID" || status === "Completed") {
          setPaymentStatus("Completed");
          clearInterval(interval);
        } else if (status === "FAILED" || status === "Failed") {
          setPaymentStatus("Failed");
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaymentInitiated, paymentId, paymentStatus]);

  // --- NEW: FACEBOOK PIXEL PURCHASE TRACKING ---
  useEffect(() => {
    if (paymentStatus === "Completed") {
      ReactPixel.track('Purchase', {
        value: plan?.amount || 5.00,
        currency: 'USD',
        content_name: plan?.planName
      });
    }
  }, [paymentStatus, plan]);

  const handlePayment = async (e) => {
    e.preventDefault();

    // --- NEW: FACEBOOK PIXEL INITIATE CHECKOUT TRACKING ---
    ReactPixel.track('InitiateCheckout', {
      content_name: plan?.planName,
      value: plan?.amount,
      currency: 'USD'
    });

    setLoading(true);
    try {
      if (couponCode.trim().toUpperCase().startsWith("FREE")) {
        setRedeemingCoupon(true);
        await redeemCouponCode({ code: couponCode.trim() });
        navigate("/salon-owner/dashboard");
        return;
      }

      const response = await subscribe({ 
        planId, 
        countryCode: selectedRegion.code, 
        currency: selectedRegion.currency 
      });

      if (response.data?.data?.paymentUrl) {
        setPaymentId(response.data.data.paymentReference);
        setPaymentUrl(response.data.data.paymentUrl);
        setIsPaymentInitiated(true);
        window.open(response.data.data.paymentUrl, "_blank");
      }
    } catch (err) {
      toast.error("Payment initiation failed");
    } finally {
      setLoading(false);
      setRedeemingCoupon(false);
    }
  };

  const localAmount = Math.ceil((plan?.amount || 0) * exchangeRate);

  if (fetching) return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-4xl text-primary-purple" /></div>;

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 mb-8 font-bold hover:text-black">
          <FaArrowLeft className="mr-2" /> {t("payment.back")}
        </button>

        {error ? (
           <div className="bg-red-50 text-red-600 p-6 rounded-3xl text-center border border-red-100">{error}</div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-white">
            <h1 className="text-3xl font-black mb-10 tracking-tight">{t("payment.orderSummary")}</h1>
            
            <div className="bg-[#F5F5F7] rounded-3xl p-6 mb-8">
              <h2 className="text-xl font-bold text-primary-purple">{plan?.planName}</h2>
              <p className="text-gray-500 mt-1">{plan?.description}</p>
            </div>

            <div className="mb-10">
              <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest">
                <FaGlobe className="inline mr-2 text-blue-500" /> {t("payment.location")}
              </label>
              <select 
                value={selectedRegion.code}
                onChange={(e) => setSelectedRegion(SUPPORTED_REGIONS.find(r => r.code === e.target.value))}
                className="w-full p-5 bg-[#F5F5F7] rounded-[2rem] font-bold outline-none appearance-none border-none focus:ring-2 focus:ring-primary-purple"
              >
                {SUPPORTED_REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>{r.name} ({r.currency})</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center mb-10 py-6 border-y border-gray-100">
              <span className="text-lg font-bold">Total Payable</span>
              <div className="text-right">
                {fetchingRate ? (
                  <FaSpinner className="animate-spin ml-auto" />
                ) : (
                  <span className="text-4xl font-black text-primary-purple">
                    {selectedRegion.currency} {localAmount}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-10 relative">
              <FaTicketAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full pl-12 p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary-purple"
              />
            </div>

            <Button
              variant="gradient"
              onClick={handlePayment}
              disabled={loading || fetchingRate || isPaymentInitiated}
              className="w-full !py-5 rounded-full text-xl shadow-lg flex items-center justify-center gap-3"
            >
              {(loading || redeemingCoupon) && <FaSpinner className="animate-spin" />}
              {isPaymentInitiated ? "Awaiting Payment..." : `Pay Now - ${selectedRegion.currency} ${localAmount}`}
            </Button>
          </div>
        )}
      </div>

      {/* Payment Processing Modal */}
      {isPaymentInitiated && !paymentStatus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-6">
          <div className="bg-white p-10 rounded-[3rem] text-center max-w-sm w-full">
            <FaSpinner className="text-6xl text-primary-purple animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">{t("payment.processing")}</h2>
            <p className="text-gray-500 mb-8 text-sm">{t("payment.pleaseWait")}</p>
            <a href={paymentUrl} target="_blank" rel="noreferrer" className="text-primary-purple font-bold underline">Re-open Link</a>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {paymentStatus === "Completed" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-6">
          <div className="bg-white p-10 rounded-[3rem] text-center max-w-sm w-full shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 text-3xl">
              <FaCheckCircle />
            </div>
            <h2 className="text-2xl font-black text-black">Payment Success!</h2>
            <p className="text-gray-500 mt-2 mb-8 font-medium">Your subscription is now active.</p>
            <Button variant="gradient" onClick={() => navigate("/salon-owner/dashboard")} className="w-full !py-4 rounded-full">Go to Dashboard</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;