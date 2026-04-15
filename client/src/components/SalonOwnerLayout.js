"use client";

import { useState } from "react";
import {
  FaBars,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaCommentDots,
  FaConciergeBell,
  FaStar,
  FaStore,
  FaTachometerAlt,
  FaTimes,
  FaSignOutAlt,
  FaCreditCard 
} from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../context/AuthContext";

const SidebarLink = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] 
      tracking-wide transition-all duration-300 group
      ${
        isActive
          ? "bg-white/20 text-white shadow-md font-semibold backdrop-blur-md"
          : "text-gray-200 hover:bg-white/10 hover:text-white"
      }`
    }
  >
    <Icon size={18} className="opacity-90 group-hover:scale-110 transition-transform" />
    {children}
  </NavLink>
);

const SalonOwnerLayout = ({ children, activePlan }) => {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth(); // 1. Added 'user' from Context
  const location = useLocation();

  // 2. Identify the internal pages that MUST be visible to unpaid users
  const isBillingPage = location.pathname.includes("billing");
  const isPaymentPage = location.pathname.includes("pay"); 
  
  // 3. FIXED: The owner only has no access if they don't have a plan AND are not verified by admin
  const hasNoPlan = !activePlan && !user?.isVerified;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-slate-900">
      {/* Mobile toggle */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[70] bg-white shadow-lg p-3 rounded-full border border-purple-100"
        >
          <FaBars size={22} className="text-purple-700" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 z-50 p-6 flex flex-col
          bg-gradient-to-b from-purple-800 to-purple-900 text-white transition-transform duration-500
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-2xl font-black tracking-tight">
            <span className="text-purple-200">Beauty</span>Heaven
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-300">
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          <SidebarLink to="/salon-owner/dashboard" icon={FaTachometerAlt}>Dashboard</SidebarLink>
          <SidebarLink to="/salon-owner/appointments" icon={FaCalendarAlt}>Appointments</SidebarLink>
          <SidebarLink to="/salon-owner/profile" icon={FaStore}>Salon Profile</SidebarLink>
          <SidebarLink to="/salon-owner/services" icon={FaConciergeBell}>Services</SidebarLink>
          
          {/* Billing Link is always visible */}
          <SidebarLink to="/salon-owner/billing" icon={FaCreditCard}>
            Subscription & Billing
          </SidebarLink>

          <SidebarLink to="/salon-owner/messages" icon={FaCommentDots}>Messages</SidebarLink>
          <SidebarLink to="/salon-owner/reviews" icon={FaStar}>Reviews</SidebarLink>
          <SidebarLink to="/salon-owner/analytics" icon={FaChartLine}>Analytics</SidebarLink>
          <SidebarLink to="/salon-owner/settings" icon={FaCog}>Settings</SidebarLink>

          <button onClick={logout} className="w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-xl text-purple-200 hover:bg-red-500/20 hover:text-red-100 transition-all font-bold">
            <FaSignOutAlt size={18} /> Logout
          </button>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-white/10">
          <LanguageSwitcher />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        
        {/* 
            BLOCKING LOGIC: 
            Show the warning ONLY IF:
            - User has no plan AND is not verified by Admin
            - AND User is NOT on the billing page 
            - AND User is NOT on the payment page
        */}
        {hasNoPlan && !isBillingPage && !isPaymentPage ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="max-w-xl w-full bg-white border-2 border-yellow-100 p-10 rounded-[3rem] shadow-2xl text-center">
                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 text-3xl">
                   ⚠️
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Account Inactive</h2>
                <p className="text-gray-500 mt-4 text-lg leading-relaxed">
                    Your access to business tools is restricted. Please select a subscription plan to activate your salon and start receiving bookings.
                </p>
                <Link to="/salon-owner/billing">
                  <button className="mt-8 bg-purple-600 text-white px-12 py-4 rounded-full font-black text-lg shadow-xl hover:bg-purple-700 hover:scale-105 transition-all">
                    Choose Your Plan &rarr;
                  </button>
                </Link>
            </div>
          </div>
        ) : (
          /* Render the actual page content (Dashboard, Billing, or Pay) */
          <div className="animate-in fade-in duration-500">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};

export default SalonOwnerLayout;