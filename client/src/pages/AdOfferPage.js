"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaCheckCircle, FaRocket, FaMagic, FaGift, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom"; 

const AdOfferPage = () => {
  // === WHATSAPP CONFIGURATION ===
  const whatsappNumber = "237687950618";
  const customMessage = "Hello BeautyHeaven team! I saw your Skincare/Beauty business offer for $5 and I want to get more customers online. Please help me create my professional profile and start my FREE month of promotion.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`;

  return (
    <div className="bg-[#F5F5F7] min-h-screen font-sans antialiased text-[#1D1D1F] overflow-x-hidden">
      
      {/* 1. TIGHT NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-[100] bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary-purple transition-colors"
          >
            <FaArrowLeft /> Back
          </Link>
          <span className="font-black tracking-tighter text-base text-primary-purple">BeautyHeaven</span>
          <div className="w-8"></div>
        </div>
      </nav>

      {/* 2. MAIN CONTENT: Minimal padding-top (pt-16) to close the gap */}
      <main className="max-w-4xl mx-auto px-4 pt-16 pb-20">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-6xl font-black tracking-[-0.04em] leading-tight mb-4">
            Get More <br />
            <span className="bg-gradient-to-r from-primary-purple to-pink-500 bg-clip-text text-transparent">
              Customers Online.
            </span>
          </h1>
          <p className="text-base md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed px-2">
          Are you into skincare or beauty business and want to get more customers online?
We will help you create a professional profile that will act as your website, catalog, and price list, so customers can see your services and contact you easily.
We will do this for just $5.
After that, we will also help you promote your business for FREE for one month.Click the link below to chat with us on WhatsApp and get started now!
          </p>

          {/* WHATSAPP BUTTON IMMEDIATELY AFTER TEXT */}
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mt-6 flex justify-center"
          >
            <a 
              href={whatsappUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white py-4 px-10 rounded-full font-black text-lg shadow-xl flex items-center gap-3 active:scale-95 transition-transform"
            >
              <FaWhatsapp size={24} /> Get Started Now
            </a>
          </motion.div>
        </motion.div>

        {/* 3. THE INFO CARD */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative bg-white rounded-[2rem] shadow-sm border border-white overflow-hidden p-8 md:p-12 mb-10"
        >
          <h2 className="text-xl md:text-3xl font-black tracking-tight mb-6 leading-tight text-center md:text-left">
            Your professional profile acts as your <span className="text-primary-purple italic">Website, Catalog, and Price List.</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                  "Business Profile",
                  "Service Catalog",
                  "Auto Price List",
                  "WhatsApp Booking"
              ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#F5F5F7] p-3 rounded-xl">
                      <FaCheckCircle className="text-green-500 shrink-0 text-sm" />
                      <span className="font-bold text-gray-700 text-sm">{text}</span>
                  </div>
              ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center">
             <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">Total Setup Fee</p>
             <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-black">$5</span>
                  <span className="text-gray-400 font-bold line-through text-lg">$25</span>
              </div>
          </div>
        </motion.div>

        {/* 4. TIGHT TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-[1.5rem] border border-white shadow-sm text-center">
                <FaGift className="text-pink-500 text-2xl mx-auto mb-2" />
                <h4 className="font-black text-lg">FREE Promo</h4>
                <p className="text-gray-400 text-xs font-medium">1 month marketing included.</p>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] border border-white shadow-sm text-center">
                <FaRocket className="text-primary-purple text-2xl mx-auto mb-2" />
                <h4 className="font-black text-lg">Instant Listing</h4>
                <p className="text-gray-400 text-xs font-medium">Live within 24 hours.</p>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] border border-white shadow-sm text-center">
                <FaMagic className="text-blue-500 text-2xl mx-auto mb-2" />
                <h4 className="font-black text-lg">Zero Effort</h4>
                <p className="text-gray-400 text-xs font-medium">We do all the tech work.</p>
            </div>
        </div>

      </main>

      <footer className="pb-10 text-center text-gray-400">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em]">BeautyHeaven &copy; 2024</p>
      </footer>
    </div>
  );
};

export default AdOfferPage;