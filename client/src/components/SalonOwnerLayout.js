"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  FaSignOutAlt // Logout icon
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
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
    <Icon
      size={18}
      className="opacity-90 group-hover:scale-110 transition-transform"
    />
    {children}
  </NavLink>
);

const SalonOwnerLayout = ({ children }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { logout } = useAuth(); // Get logout function

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100/40 to-white overflow-hidden">
      {/* Mobile toggle */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[70] 
          bg-white/90 backdrop-blur-lg shadow-lg p-3 rounded-full 
          active:scale-95 transition"
        >
          <FaBars size={22} className="text-purple-700" />
        </button>
      )}

      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* ▓ Premium Purple Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full w-64 z-50 p-6 flex flex-col
          bg-gradient-to-b from-purple-800/80 to-purple-900/90
          border-r border-white/10 text-white shadow-xl backdrop-blur-2xl
          transition-transform duration-500

          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
              BeautyHeaven
            </span>
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-300"
          >
            <FaTimes size={22} />
          </button>
        </div>

        <p className="text-[11px] text-purple-200/70 mb-3 uppercase tracking-widest font-bold">
          {t("ownerSidebar.ownerPortal")}
        </p>

        {/* Navigation Area */}
        <nav
          className="flex-1 space-y-1 pr-1 overflow-y-auto 
          scrollbar-thin scrollbar-thumb-purple-400/20 
          hover:scrollbar-thumb-purple-400/40 
          [scrollbar-width:none] 
          [&::-webkit-scrollbar]:w-0"
        >
          <SidebarLink to="/salon-owner/dashboard" icon={FaTachometerAlt} onClick={() => setOpen(false)}>
            {t("ownerSidebar.dashboard")}
          </SidebarLink>
          <SidebarLink to="/salon-owner/appointments" icon={FaCalendarAlt} onClick={() => setOpen(false)}>
            {t("ownerSidebar.appointments")}
          </SidebarLink>
          <SidebarLink to="/salon-owner/profile" icon={FaStore} onClick={() => setOpen(false)}>
            {t("ownerSidebar.mySalonProfile")}
          </SidebarLink>
          <SidebarLink to="/salon-owner/services" icon={FaConciergeBell} onClick={() => setOpen(false)}>
            {t("ownerSidebar.services")}
          </SidebarLink>
          <SidebarLink to="/salon-owner/messages" icon={FaCommentDots} onClick={() => setOpen(false)}>
            {t("ownerSidebar.messages")}
          </SidebarLink>
          <SidebarLink to="/salon-owner/reviews" icon={FaStar} onClick={() => setOpen(false)}>
            {t("ownerSidebar.reviews")}
          </SidebarLink>
          <SidebarLink to="/salon-owner/analytics" icon={FaChartLine} onClick={() => setOpen(false)}>
            {t("ownerSidebar.analytics")}
          </SidebarLink>
          <SidebarLink to="/salon-owner/settings" icon={FaCog} onClick={() => setOpen(false)}>
            {t("ownerSidebar.settings")}
          </SidebarLink>

          {/* --- NEW: LOGOUT BUTTON --- */}
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] 
            tracking-wide transition-all duration-300 group text-purple-200 hover:bg-red-500/20 hover:text-red-200"
          >
            <FaSignOutAlt size={18} className="opacity-90 group-hover:scale-110 transition-transform" />
            {t("header.logout")}
          </button>
        </nav>

        {/* Bottom Section */}
        <div className="mt-6 pt-4 border-t border-white/10 space-y-4">
          <LanguageSwitcher />
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 text-gray-800 lg:ml-0">
        {children}
      </main>
    </div>
  );
};

export default SalonOwnerLayout;