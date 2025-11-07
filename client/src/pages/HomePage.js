// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom'; // <-- Make sure Link is imported
import { FaUserFriends, FaStore, FaHeart, FaShieldAlt, FaRegCreditCard, FaRocket, FaMapMarkerAlt } from 'react-icons/fa';
import { BsChatDots, BsCalendarCheck } from "react-icons/bs";
import { MdAnalytics, MdRateReview } from "react-icons/md";
import Button from '../components/Button';
import heroBg from '../assets/hero-main-bg.jpg';

const HomePage = () => {
  return (
    <div className="bg-[#F9FAFB]">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-4" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-white opacity-60"></div>
        <div className="relative z-10">
          <div className="flex justify-center items-center mb-4">
            <span className="text-5xl font-extrabold bg-gradient-to-r from-primary-pink to-primary-purple text-transparent bg-clip-text">
              BeautyHub
            </span>
            <FaHeart className="text-pink-400 text-4xl ml-2" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-4">Welcome to Africa's Premier Beauty Platform</h1>
          <p className="text-lg text-text-muted max-w-3xl mx-auto mb-8">
            Connect with the finest beauty salons across Africa. Whether you’re looking for your next beauty appointment or growing your salon business, we’ve got you covered.
          </p>
          <div className="flex justify-center space-x-8 text-text-main font-semibold">
            <span>10+ Countries</span>
            <span>1000+ Salons</span>
            <span>50K+ Happy Customers</span>
          </div>
        </div>
      </section>

      {/* Customer / Salon Owner Section */}
      <section className="container mx-auto px-6 py-16 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* I'm a Customer Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <FaUserFriends className="text-5xl text-primary-purple mb-4" />
            <h2 className="text-3xl font-bold text-text-main mb-2">I'm a Customer</h2>
            <p className="text-text-muted mb-6">Looking for beauty services and want to book appointments</p>
            <ul className="space-y-4 text-left mb-8">
              <li className="flex items-start space-x-3"><FaRocket className="text-primary-pink mt-1"/><span><strong>Discover Salons:</strong> Find the perfect beauty salon near you.</span></li>
              <li className="flex items-start space-x-3"><BsCalendarCheck className="text-primary-pink mt-1"/><span><strong>Book Appointments:</strong> Easy booking with instant confirmation.</span></li>
              <li className="flex items-start space-x-3"><BsChatDots className="text-primary-pink mt-1"/><span><strong>Direct Chat:</strong> Chat directly with salon owners.</span></li>
              <li className="flex items-start space-x-3"><MdRateReview className="text-primary-pink mt-1"/><span><strong>Reviews & Ratings:</strong> Read and write authentic reviews.</span></li>
            </ul>
            {/* --- THIS BUTTON IS NOW A LINK --- */}
            <Link to="/register?role=customer">
              <Button variant="gradient">Start as Customer →</Button>
            </Link>
          </div>

          {/* I'm a Salon Owner Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <FaStore className="text-5xl text-primary-pink mb-4" />
            <h2 className="text-3xl font-bold text-text-main mb-2">I'm a Salon Owner</h2>
            <p className="text-text-muted mb-6">Own a beauty business and want to attract more customers</p>
            <ul className="space-y-4 text-left mb-8">
              <li className="flex items-start space-x-3"><FaStore className="text-primary-pink mt-1"/><span><strong>Manage Your Salon:</strong> Complete business profile and services.</span></li>
              <li className="flex items-start space-x-3"><MdAnalytics className="text-primary-pink mt-1"/><span><strong>Analytics Dashboard:</strong> Track bookings and customer insights.</span></li>
              <li className="flex items-start space-x-3"><FaUserFriends className="text-primary-pink mt-1"/><span><strong>Customer Management:</strong> Manage appointments and customer relationships.</span></li>
              <li className="flex items-start space-x-3"><FaRegCreditCard className="text-primary-pink mt-1"/><span><strong>Payment Processing:</strong> Secure payment handling with local options.</span></li>
            </ul>
            {/* --- THIS BUTTON IS NOW A LINK --- */}
            <Link to="/register?role=salon_owner">
              <Button variant="gradient">Start as Salon Owner →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center"><FaShieldAlt className="text-4xl text-primary-purple mb-3"/> <h3 className="font-bold">Verified Salons</h3> <p className="text-sm text-text-muted">All salons are verified</p></div>
          <div className="flex flex-col items-center"><FaRegCreditCard className="text-4xl text-primary-pink mb-3"/> <h3 className="font-bold">Secure Payments</h3> <p className="text-sm text-text-muted">MTN MoMo & Orange Money</p></div>
          <div className="flex flex-col items-center"><BsChatDots className="text-4xl text-primary-purple mb-3"/> <h3 className="font-bold">Real-time Chat</h3> <p className="text-sm text-text-muted">Instant communication</p></div>
          <div className="flex flex-col items-center"><FaMapMarkerAlt className="text-4xl text-primary-pink mb-3"/> <h3 className="font-bold">Location Based</h3> <p className="text-sm text-text-muted">Find salons near you</p></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;