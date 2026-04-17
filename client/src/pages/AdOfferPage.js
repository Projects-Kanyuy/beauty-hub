"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaCheckCircle, FaRocket, FaMagic, FaGift, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdOfferPage = () => {
  const navigate = useNavigate();

  // === WHATSAPP CONFIGURATION ===
  const whatsappNumber = "237687950618"; // Removed the '+' for cleaner URL
  const customMessage = "Hello BeautyHeaven team! I saw your Skincare/Beauty business offer for $5 and I want to get more customers online. Please help me create my professional profile and start my FREE month of promotion.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`;

  return (
    <div className="bg-[#F5F5F7] min-h-screen font-sans antialiased text-[#1D1D1F] overflow-x-hidden">
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
          <span className="font-black tracking-tighter text-xl text-primary-purple">BeautyHeaven</span>
          <div className="w-10"></div> {/* Spacer for symmetry */}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        
        {/* 1. HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 inline-block">
            Limited Time Opportunity
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-[-0.04em] leading-[1.1] mb-8">
            Get More <br />
            <span className="bg-gradient-to-r from-primary-purple to-pink-500 bg-clip-text text-transparent">
              Customers Online.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed px-4">
            Are you in the skincare or beauty business and want to reach new clients every day? We help you build your digital home.
          </p>
        </motion.div>

        {/* 2. THE MAIN CALL-TO-ACTION CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-5xl mx-auto bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-white overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-stretch">
            
            {/* Left: Content Area */}
            <div className="md:w-3/5 p-10 md:p-16 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-tight">
                    Your professional profile acts as your <span className="text-primary-purple italic">Website, Catalog, and Price List.</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        "Business Profile",
                        "Service Catalog",
                        "Auto Price List",
                        "WhatsApp Booking"
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <FaCheckCircle className="text-green-500 shrink-0" />
                            <span className="font-bold text-gray-700">{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Payment & WhatsApp CTA */}
            <div className="md:w-2/5 bg-[#F5F5F7] p-10 md:p-16 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-gray-100">
                <div className="mb-8">
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-2">Setup Fee</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-7xl font-black text-black">$5</span>
                        <span className="text-gray-400 font-bold line-through text-xl">$25</span>
                    </div>
                </div>

                <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 px-8 rounded-[2rem] font-black text-xl shadow-xl shadow-green-200 transition-all flex items-center justify-center gap-4 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <FaWhatsapp size={28} /> Start Setup
                </a>
                <p className="mt-4 text-[11px] font-bold text-gray-400 uppercase tracking-tighter italic">
                    Pay after account is ready
                </p>
            </div>
          </div>
        </motion.div>

        {/* 3. FREE BONUS TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-16 md:mt-24">
            <div className="bg-white p-10 rounded-[2.5rem] border border-white shadow-sm text-center">
                <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <FaGift size={28} />
                </div>
                <h4 className="font-black text-2xl mb-2">FREE Promo</h4>
                <p className="text-gray-500 font-medium">We promote your business for FREE for one full month.</p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-white shadow-sm text-center">
                <div className="w-16 h-16 bg-purple-50 text-primary-purple rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <FaRocket size={28} />
                </div>
                <h4 className="font-black text-2xl mb-2">Instant Go-Live</h4>
                <p className="text-gray-500 font-medium">Get listed and start receiving clients within 24 hours.</p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-white shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <FaMagic size={28} />
                </div>
                <h4 className="font-black text-2xl mb-2">Zero Effort</h4>
                <p className="text-gray-500 font-medium">You focus on beauty, we handle the technical heavy lifting.</p>
            </div>
        </div>

        {/* 4. FINAL URGENCY BANNER */}
        <div className="mt-24 md:mt-32 text-center bg-[#1D1D1F] rounded-[3rem] md:rounded-[5rem] p-12 md:p-28 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
                  Don't Stay Invisible. <br /> Let Clients Find You.
                </h2>
                <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-gray-900 px-12 md:px-20 py-5 rounded-full font-black text-xl md:text-3xl hover:scale-105 transition-transform shadow-2xl"
                >
                    Get Started Now
                </a>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-8">Limited slots available this week</p>
            </div>
            {/* Background Accent */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
                <span className="text-[45vw] font-black tracking-tighter uppercase italic">Beauty</span>
            </div>
        </div>
      </main>

      <footer className="pb-16 text-center text-gray-400">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em]">BeautyHeaven &copy; 2024</p>
      </footer>
    </div>
  );
};

export default AdOfferPage;