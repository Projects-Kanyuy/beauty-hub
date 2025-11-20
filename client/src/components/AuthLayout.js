// src/components/AuthLayout.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaChartBar, FaBook } from 'react-icons/fa';
import authBgImage from '../assets/auth-bg.jpg';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column (Branding) */}
      <div className="relative hidden lg:flex flex-col justify-center items-center p-12 text-white" style={{ backgroundImage: `url(${authBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-pink to-primary-purple opacity-80"></div>
        <div className="relative z-10 w-full max-w-md">
          <Link to="/" className="text-5xl font-extrabold mb-8 block">BeautyHeaven ♡</Link>
          <h1 className="text-4xl font-bold mb-4">Grow Your Beauty Business</h1>
          <p className="text-purple-200 mb-8">
            Join Cameroon's premier beauty platform and connect with thousands of potential customers.
          </p>
          <ul className="space-y-4 text-lg mb-8">
            <li className="flex items-center space-x-3"><FaCheckCircle /><span className="font-semibold">Increased Visibility</span></li>
            <li className="flex items-center space-x-3"><FaChartBar /><span className="font-semibold">Analytics Tools</span></li>
            <li className="flex items-center space-x-3"><FaBook /><span className="font-semibold">Booking Management</span></li>
          </ul>
          <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur-sm">
            <p className="italic">"BeautyHeaven helped me double my clientele in 3 months!"</p>
            <p className="font-bold mt-2">- Marie, Salon Elegance Douala</p>
          </div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="w-full flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {children} {/* This is where the Login or Register form will be rendered */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;