import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(formData);
      toast.success(t("login.success"));

      if (userData.role === "salon_owner") {
        navigate("/salon-owner/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex items-center mb-8">
        <Link
          to="/login"
          className="px-6 py-3 font-bold text-center text-primary-purple border-b-2 border-primary-purple"
        >
          {t("login.signIn")}
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 font-bold text-center text-gray-400"
        >
          {t("login.createAccount")}
        </Link>
      </div>
      <div className="bg-gray-200 text-center p-3 rounded-lg mb-6">
        <h2 className="font-semibold">{t("login.portalTitle")}</h2>
        <p className="text-sm text-text-muted">
          {t("login.portalDescription")}
        </p>
      </div>
      <h3 className="text-2xl font-bold text-text-main mb-6">
        {t("login.title")}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-text-muted mb-1"
            htmlFor="email"
          >
            {t("login.businessEmail")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
            required
          />
        </div>
        <div className="mb-4 relative">
          <label
            className="block text-sm font-medium text-text-muted mb-1"
            htmlFor="password"
          >
            {t("login.password")}
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              className="rounded text-primary-purple focus:ring-primary-purple"
            />
            <span>{t("login.rememberMe")}</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary-purple hover:underline"
          >
            {t("login.forgotPassword")}
          </Link>
        </div>
        <Button
          variant="gradient"
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? t("login.signingIn") : t("login.signIn")}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
