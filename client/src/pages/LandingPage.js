"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaStar} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F5F5F7] min-h-screen overflow-x-hidden font-sans antialiased text-[#1D1D1F]">
      
      {/* 1. HERO SECTION - RESPONSIVE SCALING */}
      <section className="relative pt-20 md:pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Fluid Heading: text-4xl on mobile, text-8xl on desktop */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[100px] font-black tracking-[-0.04em] leading-[1.1] md:leading-[0.9] mb-6 md:mb-10">
              Turn Your Beauty <br /> 
              <span className="bg-gradient-to-r from-primary-purple to-pink-500 bg-clip-text text-transparent">
                Skills Into a Business.
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-snug mb-10 md:mb-16 px-4">
              Skip the salon rent. Connect with premium clients who want VIP beauty services at home.
            </p>
          </motion.div>

          {/* --- THE UNIFIED HERO CARD (Mobile Optimized) --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-4xl mx-auto bg-white rounded-[2.5rem] md:rounded-[4rem] p-3 md:p-4 shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-white flex flex-col md:flex-row items-center gap-3 md:gap-4 group"
          >
            {/* Price Side */}
            <div className="bg-[#F5F5F7] w-full md:w-1/3 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 text-center md:text-left border border-gray-100 transition-colors group-hover:bg-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-purple mb-2 block">Launch Offer</span>
              <div className="flex items-baseline justify-center md:justify-start gap-1">
                <span className="text-5xl md:text-6xl font-black">$5</span>
                <span className="text-gray-400 font-bold text-lg">/mo</span>
              </div>
              <p className="text-xs text-gray-400 font-bold mt-2 line-through">$25 Monthly</p>
            </div>

            {/* CTA Side */}
            <div className="w-full md:w-2/3 p-2 md:p-4">
              <Button 
                variant="gradient" 
                onClick={() => navigate("/become-salon-owner")}
                className="w-full !py-6 md:!py-10 rounded-[2rem] md:rounded-[3rem] text-xl md:text-2xl font-black shadow-xl flex items-center justify-center gap-4 active:scale-[0.98] transition-all"
              >
                Create Your Profile Now <FaArrowRight className="text-lg" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION - FLEXIBLE GRID */}
      <section className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="lg:col-span-5 space-y-8 md:space-y-10 order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">Starting a Business <br className="hidden md:block" /> Shouldn't Be Expensive.</h2>
            <div className="space-y-4 md:space-y-6">
              {[
                { t: "No Salon Rent", d: "Keep 100% of your earnings every month." },
                { t: "Built-in Marketing", d: "Visibility to thousands of beauty seekers." },
                { t: "Direct Booking", d: "WhatsApp integrated scheduling and chat." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 md:p-6 bg-white rounded-3xl border border-white shadow-sm hover:shadow-md transition-all">
                  <div className="h-2 w-2 rounded-full bg-primary-purple mt-2.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">{item.t}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 h-[350px] md:h-[600px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl relative order-1 lg:order-2">
             <img 
               src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200" 
               alt="Beauty Artist at work" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-primary-purple/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES - VIVID GALLERY */}
      <section className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">What You Can List.</h2>
            <p className="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-[0.2em]">Promote Expertise. Build Trust.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {[
            { name: "Hair Styling", img: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=500", tag: "Master Braider" },
            { name: "Bridal Makeup", img: "https://images.unsplash.com/photo-1619183492791-31353e87701e?q=80&w=1000", tag: "Luxury Finish" }, // Chocolate skin bride color photo
            { name: "Nail Artistry", img: "https://images.unsplash.com/photo-1604654894610-df4906821603?q=80&w=500", tag: "Premium Sets" }
          ].map((cat, i) => (
            <div key={i} className="group relative h-[400px] md:h-[550px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-xl border border-white transition-all duration-700 hover:shadow-2xl">
              <img src={cat.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={cat.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 text-white">
                 <span className="text-[9px] font-black uppercase tracking-widest bg-white text-primary-purple px-3 py-1 rounded-full mb-3 inline-block">{cat.tag}</span>
                 <h3 className="text-3xl md:text-4xl font-black tracking-tighter">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FINAL OFFER - RESPONSIVE BANNER */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto bg-[#1D1D1F] rounded-[3rem] md:rounded-[5rem] p-10 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-10 md:space-y-12">
             <div className="inline-block p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <FaStar className="text-yellow-400 text-xl" />
             </div>
             <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[1.1]">Special <br className="md:hidden" /> Launch Offer.</h2>
             <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium px-4">
                Build your client base for the price of a coffee. One full month of Pro features for just:
             </p>
             
             <div className="flex flex-col items-center">
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-inner relative px-16 md:px-24">
                  <p className="text-7xl md:text-[120px] font-black text-primary-purple leading-none tracking-tighter">$5</p>
                  <p className="text-sm md:text-lg font-bold text-gray-500 mt-4 md:mt-6 uppercase tracking-widest">First 30 Days</p>
                  <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-white text-black font-black px-4 py-2 md:p-4 rounded-full text-[10px] md:text-xs rotate-12 shadow-xl border-4 border-[#1D1D1F]">SAVE 80%</div>
                </div>
             </div>

             <div className="pt-6 md:pt-10">
                <Button 
                  variant="gradient" 
                  onClick={() => navigate("/become-salon-owner")}
                  className="w-full md:w-auto !py-6 md:!py-8 px-12 md:px-20 rounded-full text-xl md:text-3xl font-black shadow-2xl hover:scale-105 transition-all"
                >
                  Join for $5 Today
                </Button>
             </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
             <span className="text-[50vw] font-black">PRO</span>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center text-gray-400 px-6">
         <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] leading-relaxed">
            BeautyHeaven © 2024 — Engineering The Future of Local Beauty
         </p>
      </footer>
    </div>
  );
};

export default LandingPage;