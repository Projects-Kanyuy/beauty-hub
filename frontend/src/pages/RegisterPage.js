// src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import { FaEye, FaEyeSlash, FaUserFriends, FaStore } from 'react-icons/fa';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', salonName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [selectedRole, setSelectedRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    if (roleFromUrl === 'salon_owner' || roleFromUrl === 'customer') {
      setSelectedRole(roleFromUrl);
    }
  }, [searchParams]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      role: selectedRole,
    };
    
    try {
      const userData = await register(payload);
      toast.success('Account Created Successfully!');
      
      // THE CRITICAL FIX: Check role and navigate
      if (userData.role === 'salon_owner') {
        navigate('/salon-owner/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h3 className="text-3xl font-bold text-text-main mb-4">Create Your Account</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button onClick={() => setSelectedRole('customer')} className={`p-4 rounded-lg border-2 text-left transition-colors ${selectedRole === 'customer' ? 'border-primary-purple bg-purple-50' : 'border-gray-300 bg-white'}`}><FaUserFriends className={`mb-2 text-2xl ${selectedRole === 'customer' ? 'text-primary-purple' : 'text-gray-400'}`} /><p className="font-bold">I'm a Customer</p></button>
        <button onClick={() => setSelectedRole('salon_owner')} className={`p-4 rounded-lg border-2 text-left transition-colors ${selectedRole === 'salon_owner' ? 'border-primary-purple bg-purple-50' : 'border-gray-300 bg-white'}`}><FaStore className={`mb-2 text-2xl ${selectedRole === 'salon_owner' ? 'text-primary-purple' : 'text-gray-400'}`} /><p className="font-bold">I'm a Salon Owner</p></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-text-muted mb-1">First Name</label><input type="text" name="firstName" onChange={handleChange} className="w-full p-2 border rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-text-muted mb-1">Last Name</label><input type="text" name="lastName" onChange={handleChange} className="w-full p-2 border rounded-lg" required /></div>
        </div>
        <div><label className="block text-sm font-medium text-text-muted mb-1">Email</label><input type="email" name="email" onChange={handleChange} className="w-full p-2 border rounded-lg" required /></div>
        {selectedRole === 'salon_owner' && (
          <>
            <div><label className="block text-sm font-medium text-text-muted mb-1">Salon Name *</label><input type="text" name="salonName" onChange={handleChange} placeholder="e.g. African Beauty Salon" className="w-full p-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium text-text-muted mb-1">Phone Number</label><input type="tel" name="phone" onChange={handleChange} placeholder="+237 XXXXXXXXX" className="w-full p-2 border rounded-lg" /></div>
          </>
        )}
        <div className="relative"><label className="block text-sm font-medium text-text-muted mb-1">Password</label><input type={showPassword ? 'text' : 'password'} name="password" onChange={handleChange} className="w-full p-2 border rounded-lg" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-gray-500">{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
        <div className="relative"><label className="block text-sm font-medium text-text-muted mb-1">Confirm Password</label><input type="password" name="confirmPassword" onChange={handleChange} className="w-full p-2 border rounded-lg" required /></div>
        <div className="flex items-start space-x-2 pt-2">
          <input type="checkbox" id="terms" className="mt-1 rounded text-primary-purple focus:ring-primary-purple" required />
          <label htmlFor="terms" className="text-sm text-text-muted">I agree to the <Link to="/terms" className="underline text-primary-purple">Terms of Service</Link> and <Link to="/privacy" className="underline text-primary-purple">Privacy Policy</Link></label>
        </div>
        <Button variant="gradient" type="submit" className="w-full !mt-6" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
      <p className="text-center mt-6 text-sm">Already have an account? <Link to="/login" className="font-semibold text-primary-purple hover:underline">Sign In</Link></p>
    </AuthLayout>
  );
};

export default RegisterPage;