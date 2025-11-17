// src/components/Navbar.js
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";

const NavItem = ({ to, children }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `hover:text-primary-pink transition-colors pb-1 text-base ${
          isActive
            ? "font-bold text-primary-purple border-b-2 border-primary-purple"
            : "font-semibold text-text-main"
        }`
      }
    >
      {children}
    </NavLink>
  </li>
);

// The Navbar now accepts the `user` object as a prop
const Navbar = ({ isLoggedIn, user, handleLogout }) => {
  // Helper function to get initials from a name (e.g., "Ndip Samuel" -> "NS")
  const getInitials = (name) => {
    if (!name) return "?"; // Return a placeholder if name is not available
    const names = name.split(" ");
    // Handle single names like "Admin"
    if (names.length === 1 && names[0].length > 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    // Handle multiple names
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    // Fallback for very short names
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold">
          <span className="bg-gradient-to-r from-primary-pink to-primary-purple text-transparent bg-clip-text">
            BeautyHub
          </span>
        </Link>

        {/* Dynamic Navigation Links */}
        <ul className="hidden lg:flex items-center space-x-8">
          {isLoggedIn ? (
            // Logged In View
            <>
              <NavItem to="/dashboard">Dashboard</NavItem>
              <NavItem to="/favorites">Favorites</NavItem>
              <NavItem to="/compare">Compare</NavItem>
              <NavItem to="/messages">Messages</NavItem>
            </>
          ) : (
            // Guest View
            <>
              <NavItem to="/">Home</NavItem>
              <NavItem to="/subscriptions">Add Your Salon</NavItem>
              <NavItem to="/tips">Beauty Tips</NavItem>
              <NavItem to="/about">About Us</NavItem>
              <NavItem to="/contact">Contact</NavItem>
            </>
          )}
        </ul>

        {/* Dynamic User Actions */}
        <div className="flex items-center space-x-4">
          {isLoggedIn && (
            // Logged In View with dynamic initial
            <>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-text-main cursor-pointer">
                {getInitials(user?.name)}
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:block px-5 py-2.5 rounded-lg font-bold text-white bg-gray-800 hover:bg-gray-900 transition-colors"
              >
                Logout
              </button>
            </>
          )}
          {/* : (
            Guest View
           <Link to="/login" className="px-5 py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-primary-pink to-primary-purple hover:opacity-90 transition-opacity">
             Get Started
            </Link>
           )} */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
