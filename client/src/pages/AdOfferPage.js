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
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-[100] bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* FIXED: Link points exactly to home page */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-purple transition-colors"
          >
            <FaArrowLeft /> Back
          </Link>
          <span className="font-black tracking-tighter text-lg text-primary-purple">BeautyHeaven</span>
          <div className="w-8"></div>
        </div>
      </nav>

      {/* Main Content: Reduced pt-32 to pt-20 for mobile */}
      <main className="max-w-6xl mx-auto px-4 pt-20 md:pt-32 pb-20">
        
        {/* HERO SECTION: Reduced top space by lowering margin-top and padding */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-20"
        >
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block">
            Limited Time Opportunity
          </span>
          <h1 className="text-3xl sm:text-6xl md:text-8xl font-black tracking-[-0.04em] leading-tight mb-4 md:mb-8">
            Get More <br />
            <span className="bg-gradient-to-r from-primary-purple to-pink-500 bg-clip-text text-transparent">
              Customers Online.
            </span>
          </h1>
          <p className="text-base md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed px-2">
            Are you in the skincare or beauty business and want to reach new clients every day? We help you build your digital home.
          </p>
        </motion.div>

        {/* THE MAIN CALL-TO-ACTION CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-5xl mx-auto bg-white rounded-[2rem] md:rounded-[4rem] shadow-sm border border-white overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-stretch">
            
            {/* Left: Content Area */}
            <div className="md:w-3/5 p-8 md:p-16 flex flex-col justify-center">
                <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-6 leading-tight">
                    Your professional profile acts as your <span className="text-primary-purple italic">Website, Catalog, and Price List.</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                    {[
                        "Business Profile",
                        "Service Catalog",
                        "Auto Price List",
                        "WhatsApp Booking"
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <FaCheckCircle className="text-green-500 shrink-0 text-sm" />
                            <span className="font-bold text-gray-700 text-sm md:text-base">{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Payment & WhatsApp CTA */}
            <div className="md:w-2/5 bg-[#F5F5F7] p-8 md:p-16 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-gray-100">
                <div className="mb-6">
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">Setup Fee</p>
                    <div className="flex items-baseline gap-1 justify-center">
                        <span className="text-6xl md:text-7xl font-black text-black">$5</span>
                        <span className="text-gray-400 font-bold line-through text-lg">$25</span>
                    </div>
                </div>

                <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white py-5 px-6 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <FaWhatsapp size={24} /> Start Setup
                </a>
                <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase italic">
                    Pay after account is ready
                </p>
            </div>
          </div>
        </motion.div>

        {/* FREE BONUS TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 mt-10 md:mt-24">
            <div className="bg-white p-8 rounded-[2rem] border border-white shadow-sm text-center">
                <FaGift className="text-pink-500 text-3xl mx-auto mb-4" />
                <h4 className="font-black text-xl mb-2">FREE Promo</h4>
                <p className="text-gray-500 text-sm font-medium">1 month marketing included for FREE.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-white shadow-sm text-center">
                <FaRocket className="text-primary-purple text-3xl mx-auto mb-4" />
                <h4 className="font-black text-xl mb-2">Instant Listing</h4>
                <p className="text-gray-500 text-sm font-medium">Get start receiving clients within 24 hours.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-white shadow-sm text-center">
                <FaMagic className="text-blue-500 text-3xl mx-auto mb-4" />
                <h4 className="font-black text-xl mb-2">Zero Effort</h4>
                <p className="text-gray-500 text-sm font-medium">You focus on beauty, we do the tech.</p>
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