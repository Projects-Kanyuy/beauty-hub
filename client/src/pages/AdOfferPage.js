"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaCheckCircle, FaRocket, FaMagic, FaGift, FaArrowRight } from "react-icons/fa";
import Footer from "../components/Footer";

const AdOfferPage = () => {
  // === WHATSAPP CONFIGURATION ===
  const whatsappNumber = "+237687950618";
  const customMessage = "Hello BeautyHeaven team! I saw your Skincare/Beauty business offer for $5 and I want to get more customers online. Please help me create my professional profile and start my FREE month of promotion.";
  
  // Encodes the message to be URL friendly
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`;

  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans text-slate-900 overflow-x-hidden">

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        
        {/* 1. Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
            Limited Time Opportunity
          </span>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight text-gray-900 mb-6">
            Get More <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Customers Online.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Are you in the skincare or beauty business and want to reach new clients every day? We help you build your digital home.
          </p>
        </motion.div>

        {/* 2. Main Offer Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.06)] overflow-hidden border border-purple-50 flex flex-col md:flex-row mb-20"
        >
          {/* Left Side: The "Why" */}
          <div className="md:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 p-12 text-white flex flex-col justify-center relative">
            <h2 className="text-3xl font-black mb-8 leading-tight italic">
              "We build your website, catalog, and price list so you can focus on beauty."
            </h2>
            <div className="space-y-5 relative z-10">
              {[
                "Professional Business Profile",
                "Digital Service Catalog",
                "Automated Price List",
                "Direct WhatsApp Bookings"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-white/20 p-1 rounded-full">
                    <FaCheckCircle className="text-pink-300" />
                  </div>
                  <span className="font-bold text-lg">{text}</span>
                </div>
              ))}
            </div>
            {/* Background Decoration */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          {/* Right Side: The "Price" and CTA */}
          <div className="md:w-1/2 p-12 flex flex-col justify-center text-center md:text-left bg-white">
            <div className="mb-6">
                <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Professional Setup</p>
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <span className="text-6xl font-black text-gray-900">$5</span>
                    <span className="text-gray-400 font-bold line-through">$25</span>
                </div>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-10 font-medium">
              Customers in your area are searching for you. Stop staying invisible and start being professional.
            </p>

            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white py-5 px-8 rounded-2xl font-black text-xl shadow-2xl shadow-green-200 transition-all flex items-center justify-center gap-4 transform hover:scale-105 active:scale-95 group"
            >
              <FaWhatsapp size={28} /> Chat to Start <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* 3. Features/Bonus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-pink-50 p-10 rounded-[2.5rem] border border-pink-100 text-center relative overflow-hidden"
            >
                <div className="w-14 h-14 bg-pink-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink-200">
                    <FaGift size={24} />
                </div>
                <h4 className="font-black text-2xl text-pink-900 mb-3">FREE Promo</h4>
                <p className="text-pink-700/80 text-base font-bold">1 Full Month of marketing included for FREE.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-purple-50 p-10 rounded-[2.5rem] border border-purple-100 text-center relative overflow-hidden"
            >
                <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-200">
                    <FaRocket size={24} />
                </div>
                <h4 className="font-black text-2xl text-purple-900 mb-3">Instant Listing</h4>
                <p className="text-purple-700/80 text-base font-bold">Get your business listed and live in 24 hours.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-indigo-50 p-10 rounded-[2.5rem] border border-indigo-100 text-center relative overflow-hidden"
            >
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                    <FaMagic size={24} />
                </div>
                <h4 className="font-black text-2xl text-indigo-900 mb-3">Zero Tech</h4>
                <p className="text-indigo-700/80 text-base font-bold">You give us your price list, we do the rest.</p>
            </motion.div>
        </div>

        {/* 4. Final Urgency CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 text-center bg-[#1D1D1F] rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl"
        >
            <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">Don't Stay Invisible. <br /> Let Clients Find You.</h2>
                <p className="text-gray-400 text-xl mb-12 max-w-xl mx-auto font-medium">This special $5 setup and FREE promo offer is limited to new businesses joining this week.</p>
                <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-gray-900 px-16 py-5 rounded-full font-black text-2xl hover:bg-purple-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                    Get Started for $5
                </a>
            </div>
            {/* Background Text Decoration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                <span className="text-[40vw] font-black tracking-tighter">BEAUTY</span>
            </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
};

export default AdOfferPage;