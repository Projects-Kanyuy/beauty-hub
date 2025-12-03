"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { redeemCouponCode } from "../api";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const selectedPlan = searchParams.get("plan");
  const couponCode = searchParams.get("coupon");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    salonName: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error(t("register.passwordsMismatch"));
    }

    setLoading(true);

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: "salon_owner",
    };

    try {
      await register(payload);
      toast.success(t("register.accountCreated"));

      // Coupon redemption flow
      if (selectedPlan && selectedPlan !== "null") {
        if (couponCode) {
          try {
            await redeemCouponCode(couponCode);
            toast.success(t("register.couponRedeemed"));
            navigate("/salon-owner/dashboard");
          } catch (err) {
            toast.error(
              `${t("register.couponRedeemFailed")}: ${
                err?.response?.data?.message ?? ""
              }`
            );
            navigate(`/payment?plan=${selectedPlan}`);
          }
        } else {
          navigate(`/payment?plan=${selectedPlan}`);
        }
      } else {
        // No plan selected
        navigate("/salon-owner/dashboard");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || t("register.registrationFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h3 className="text-3xl font-bold text-text-main mb-2">
        {t("register.createAccount")}
      </h3>
      <p className="text-text-muted mb-6">
        {selectedPlan && selectedPlan !== "null"
          ? t("register.joinMessage", { plan: selectedPlan.toUpperCase() })
          : t("register.joinMessageNoPlan")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">
              {t("register.firstName")}
            </label>
            <input
              type="text"
              name="firstName"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">
              {t("register.lastName")}
            </label>
            <input
              type="text"
              name="lastName"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            {t("register.email")}
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            {t("register.salonName")} *
          </label>
          <input
            type="text"
            name="salonName"
            onChange={handleChange}
            placeholder={t("register.salonNamePlaceholder")}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            {t("register.phoneNumber")}
          </label>
          <input
            type="tel"
            name="phone"
            onChange={handleChange}
            placeholder="+237 XXXXXXXXX"
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-text-muted mb-1">
            {t("register.password")}
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-text-muted mb-1">
            {t("register.confirmPassword")}
          </label>
          <input
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 rounded text-primary-purple focus:ring-primary-purple"
            required
          />
          <label htmlFor="terms" className="text-sm text-text-muted">
            {t("register.agreeTerms")}{" "}
            <Link to="/terms" className="underline text-primary-purple">
              {t("register.termsOfService")}
            </Link>{" "}
            {t("register.and")}{" "}
            <Link to="/privacy" className="underline text-primary-purple">
              {t("register.privacyPolicy")}
            </Link>
          </label>
        </div>

        <Button
          variant="gradient"
          type="submit"
          className="w-full !mt-6"
          disabled={loading}
        >
          {loading
            ? t("register.creatingAccount")
            : t("register.createAccountContinue")}
        </Button>
      </form>

      <p className="text-center mt-6 text-sm">
        {t("register.alreadyHaveAccount")}{" "}
        <Link
          to="/login"
          className="font-semibold text-primary-purple hover:underline"
        >
          {t("register.signIn")}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
