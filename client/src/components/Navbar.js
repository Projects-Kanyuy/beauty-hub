"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

const NavItem = ({ to, children, onClick }) => (
  <li>
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block py-2 hover:text-primary-pink transition-colors text-lg ${
          isActive
            ? "font-bold text-primary-purple"
            : "font-medium text-text-main"
        }`
      }
    >
      {children}
    </NavLink>
  </li>
);

const Navbar = ({ isLoggedIn, user, handleLogout }) => {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={closeDrawer} className="text-3xl font-extrabold">
          <span className="bg-gradient-to-r from-primary-pink to-primary-purple text-transparent bg-clip-text">
            BeautyHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center space-x-8">
          {isLoggedIn ? (
            <>
              <NavItem to="/dashboard">{t("header.dashboard")}</NavItem>
              <NavItem to="/favorites">{t("header.favorites")}</NavItem>
              <NavItem to="/compare">{t("header.compare")}</NavItem>
              <NavItem to="/messages">{t("header.messages")}</NavItem>
            </>
          ) : (
            <>
              <NavItem to="/">{t("header.home")}</NavItem>
              <NavItem to="/become-salon-owner">Add Your Business</NavItem>
              <NavItem to="/tips">{t("header.tips")}</NavItem>
              <NavItem to="/about">{t("header.about")}</NavItem>
              <NavItem to="/contact">Contact</NavItem>
            </>
          )}
        </ul>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center space-x-5">
          <LanguageSwitcher />
          {isLoggedIn && (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-text-main">
                {getInitials(user?.name)}
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg font-semibold text-white bg-gray-800 hover:bg-gray-900"
              >
                {t("header.logout")}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleDrawer} className="lg:hidden p-2 text-text-main">
          {isDrawerOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>
      </nav>

      {/* --- MOBILE DRAWER MENU --- */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeDrawer}
      ></div>

      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-xl p-6 transform transition-transform duration-300 lg:hidden z-[100] ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-xl text-primary-purple">Menu</h2>
          <LanguageSwitcher />
        </div>

        <ul className="flex flex-col space-y-4">
          {isLoggedIn ? (
            <>
              <NavItem to="/dashboard" onClick={closeDrawer}>
                {t("header.dashboard")}
              </NavItem>
              <NavItem to="/favorites" onClick={closeDrawer}>
                {t("header.favorites")}
              </NavItem>
              <NavItem to="/compare" onClick={closeDrawer}>
                {t("header.compare")}
              </NavItem>
              <NavItem to="/messages" onClick={closeDrawer}>
                {t("header.messages")}
              </NavItem>

              <button
                onClick={() => {
                  handleLogout();
                  closeDrawer();
                }}
                className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg font-semibold"
              >
                {t("header.logout")}
              </button>
            </>
          ) : (
            <>
              <NavItem to="/" onClick={closeDrawer}>
                {t("header.home")}
              </NavItem>
              <NavItem to="/become-salon-owner" onClick={closeDrawer}>
                Add Your Business
              </NavItem>
              <NavItem to="/tips" onClick={closeDrawer}>
                {t("header.tips")}
              </NavItem>
              <NavItem to="/subscriptions" onClick={closeDrawer}>
                {t("header.subscriptions")}
              </NavItem>
              <NavItem to="/about" onClick={closeDrawer}>
                {t("header.about")}
              </NavItem>
              <NavItem to="/contact" onClick={closeDrawer}>
                Contact
              </NavItem>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
