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
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

const SidebarLink = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
        isActive
          ? "bg-primary-purple text-white shadow-md"
          : "text-gray-300 hover:bg-purple-700 hover:text-white"
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{children}</span>
  </NavLink>
);

const SalonOwnerLayout = ({ children }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* MOBILE FLOATING MENU BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[60] bg-white border shadow-md p-3 rounded-full active:scale-90 transition-all"
        >
          <FaBars size={22} className="text-primary-purple" />
        </button>
      )}

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 flex flex-col z-50 transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-3xl font-extrabold">
            <span className="bg-gradient-to-r from-primary-pink to-primary-purple bg-clip-text text-transparent">
              BeautyHeaven
            </span>
          </Link>

          {/* Close (mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-300"
          >
            <FaTimes size={22} />
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-4 tracking-wider uppercase">
          {t("ownerSidebar.ownerPortal")}
        </p>

        {/* LINKS */}
        <nav className="flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
          <SidebarLink
            to="/salon-owner/dashboard"
            icon={FaTachometerAlt}
            onClick={() => setOpen(false)}
          >
            {t("ownerSidebar.dashboard")}
          </SidebarLink>
          <SidebarLink
            to="/salon-owner/appointments"
            icon={FaCalendarAlt}
            onClick={() => setOpen(false)}
          >
            {t("ownerSidebar.appointments")}
          </SidebarLink>
          <SidebarLink
            to="/salon-owner/profile"
            icon={FaStore}
            onClick={() => setOpen(false)}
          >
            {t("ownerSidebar.mySalonProfile")}
          </SidebarLink>
          <SidebarLink
            to="/salon-owner/services"
            icon={FaConciergeBell}
            onClick={() => setOpen(false)}
          >
            {t("ownerSidebar.services")}
          </SidebarLink>
          <SidebarLink
            to="/salon-owner/messages"
            icon={FaCommentDots}
            onClick={() => setOpen(false)}
          >
            {t("ownerSidebar.messages")}
          </SidebarLink>
          <SidebarLink
            to="/salon-owner/reviews"
            icon={FaStar}
            onClick={() => setOpen(false)}
          >
            {t("ownerSidebar.reviews")}
          </SidebarLink>
          <SidebarLink
            to="/salon-owner/analytics"
            icon={FaChartLine}
            onClick={() => setOpen(false)}
          >
            {t("ownerSidebar.analytics")}
          </SidebarLink>
          <SidebarLink
            to="/salon-owner/settings"
            icon={FaCog}
            onClick={() => setOpen(false)}
          >
            {t("ownerSidebar.settings")}
          </SidebarLink>
        </nav>

        {/* LANGUAGE */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <LanguageSwitcher />
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
};

export default SalonOwnerLayout;
