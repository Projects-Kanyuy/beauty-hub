"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
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
              <NavItem to="/become-salon-owner">
                {t("header.addBusiness")}
              </NavItem>
              {/* <NavItem to="/tips">{t("header.tips")}</NavItem>
              <NavItem to="/about">{t("header.about")}</NavItem>*/}
              <NavItem to="/contact">{t("header.contact")}</NavItem>
            </>
          )}
        </ul>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center space-x-5">
          <LanguageSwitcher />
          {isLoggedIn ? (
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
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="font-semibold text-text-main hover:text-primary-purple transition-colors"
              >
                {t("login.signIn")}
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg font-semibold text-white bg-primary-purple hover:bg-primary-pink transition-colors"
              >
                {t("login.createAccount")}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleDrawer} className="lg:hidden p-2 text-text-main">
          {isDrawerOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 py-4">
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
                    className="w-full mt-4 px-5 py-2.5 rounded-lg font-bold text-white bg-gray-800 hover:bg-gray-900 transition-colors text-left"
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
                    {t("header.addBusiness")}
                  </NavItem>
                  <NavItem to="/tips" onClick={closeDrawer}>
                    {t("header.tips")}
                  </NavItem>
                  <NavItem to="/about" onClick={closeDrawer}>
                    {t("header.about")}
                  </NavItem>
                  <NavItem to="/contact" onClick={closeDrawer}>
                    {t("header.contact")}
                  </NavItem>
                  <NavItem to="/login" onClick={closeDrawer}>
                    {t("login.signIn")}
                  </NavItem>
                  <NavItem to="/register" onClick={closeDrawer}>
                    {t("login.createAccount")}
                  </NavItem>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
