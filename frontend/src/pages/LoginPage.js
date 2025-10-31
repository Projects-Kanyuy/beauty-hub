// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Call the login function from our context
      const userData = await login(formData); 
      
      toast.success('Login Successful!');

      // 2. THE CRITICAL FIX: Check the role and navigate accordingly
      if (userData.role === 'salon_owner') {
        navigate('/salon-owner/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex items-center mb-8">
        <Link to="/login" className="px-6 py-3 font-bold text-center text-primary-purple border-b-2 border-primary-purple">Sign In</Link>
        <Link to="/register" className="px-6 py-3 font-bold text-center text-gray-400">Create Account</Link>
      </div>
      <div className="bg-gray-200 text-center p-3 rounded-lg mb-6">
        <h2 className="font-semibold">Salon Owner Portal</h2>
        <p className="text-sm text-text-muted">Manage your salon, services, and connect with customers</p>
      </div>
      <h3 className="text-2xl font-bold text-text-main mb-6">Salon Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="email">Business Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple" required />
        </div>
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="password">Password</label>
          <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center space-x-2 text-sm"><input type="checkbox" className="rounded text-primary-purple focus:ring-primary-purple" /><span>Remember me</span></label>
          <Link to="/forgot-password" className="text-sm text-primary-purple hover:underline">Forgot password?</Link>
        </div>
        <Button variant="gradient" type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;