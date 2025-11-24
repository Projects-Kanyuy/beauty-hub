import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const selectedPlan = searchParams.get("plan") || "starter";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    salonName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    setLoading(true);

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: "salon_owner",
    };

    try {
      await register(payload);
      toast.success("Account Created Successfully!");

      navigate(`/payment?plan=${selectedPlan}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h3 className="text-3xl font-bold text-text-main mb-2">
        Create Your Account
      </h3>
      <p className="text-text-muted mb-6">
        Join BeautyHeaven and start growing your beauty business with the{" "}
        {selectedPlan.toUpperCase()} plan.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">
              First Name
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
              Last Name
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
            Email
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
            Phone Number
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
            Password
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
            Confirm Password
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
            I agree to the{" "}
            <Link to="/terms" className="underline text-primary-purple">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline text-primary-purple">
              Privacy Policy
            </Link>
          </label>
        </div>
        <Button
          variant="gradient"
          type="submit"
          className="w-full !mt-6"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account & Continue"}
        </Button>
      </form>
      <p className="text-center mt-6 text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary-purple hover:underline"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
