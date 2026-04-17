"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaCheckCircle, FaRocket, FaMagic, FaGift } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdOfferPage = () => {
  const whatsappNumber = "237674772569";
  const message = encodeURIComponent("Hello, I saw your Skincare/Beauty business offer for $5 and I want to get more customers. Please help me get started!");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans text-slate-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest mb-4 inline-block">
            Special Opportunity
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight text-gray-900">
            Want to Get More <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Customers Online?
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Are you into skincare or beauty business and struggling to reach new clients? We have the perfect solution for you.
          </p>
        </motion.div>

        {/* The Solution Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-purple-50 flex flex-col md:flex-row mb-16"
        >
          <div className="md:w-1/2 bg-purple-600 p-12 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-black mb-6 italic">"Your profile will act as your Website, Catalog, and Price List."</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-pink-300" />
                <span className="font-bold">Showcase Services</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-pink-300" />
                <span className="font-bold">Instant Contact</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-pink-300" />
                <span className="font-bold">Professional Catalog</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 p-12 flex flex-col justify-center text-center md:text-left">
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-2">Professional Setup</p>
            <h3 className="text-5xl font-black text-gray-900 mb-4">Just $5</h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              We help you build a professional digital presence so customers can see what you do and book you instantly.
            </p>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-8 rounded-full font-black text-lg shadow-xl shadow-green-200 transition-all flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95"
            >
              <FaWhatsapp size={24} /> Chat on WhatsApp
            </a>
          </div>
        </motion.div>

        {/* The Free Bonus Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-pink-50 p-8 rounded-[2rem] border border-pink-100 text-center">
                <div className="w-12 h-12 bg-pink-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FaGift size={20} />
                </div>
                <h4 className="font-black text-xl text-pink-900 mb-2">FREE Promotion</h4>
                <p className="text-pink-700/70 text-sm font-medium">We will promote your business for FREE for one full month.</p>
            </div>

            <div className="bg-purple-50 p-8 rounded-[2rem] border border-purple-100 text-center">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FaRocket size={20} />
                </div>
                <h4 className="font-black text-xl text-purple-900 mb-2">Fast Results</h4>
                <p className="text-purple-700/70 text-sm font-medium">Get your business in front of real local customers immediately.</p>
            </div>

            <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 text-center">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FaMagic size={20} />
                </div>
                <h4 className="font-black text-xl text-indigo-900 mb-2">Zero Stress</h4>
                <p className="text-indigo-700/70 text-sm font-medium">We handle the technical setup while you focus on your clients.</p>
            </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black mb-4">Don't Stay Invisible.</h2>
                <p className="text-gray-400 mb-10 max-w-xl mx-auto">This offer is limited to new beauty and skincare businesses joining this week.</p>
                <a 
                    href={whatsappUrl}
                    className="inline-block bg-white text-gray-900 px-12 py-4 rounded-full font-black text-lg hover:bg-purple-100 transition-colors"
                >
                    Get Started Now
                </a>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <FaRocket size={200} />
            </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AdOfferPage;