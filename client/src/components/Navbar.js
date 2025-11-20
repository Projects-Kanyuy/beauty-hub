import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const NavItem = ({ to, children, onClick }) => (
  <li>
    <NavLink
      to={to}
      onClick={onClick}
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold">
          <span className="bg-gradient-to-r from-primary-pink to-primary-purple text-transparent bg-clip-text">
            BeautyHeaven
          </span>
        </Link>

        {/* Dynamic Navigation Links - Desktop */}
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
              <NavItem to="/tips">Beauty Tips</NavItem>
              <NavItem to="/subscriptions">Add Your Business</NavItem>
              <NavItem to="/about">About Us</NavItem>
              {/* <NavItem to="/contact">Contact</NavItem> */}
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
        </div>

        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="lg:hidden p-2 text-text-main hover:text-primary-pink transition-colors"
          aria-label="Toggle menu"
        >
          {isDrawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {isDrawerOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <ul className="flex flex-col space-y-4">
              {isLoggedIn ? (
                // Logged In View
                <>
                  <NavItem to="/dashboard" onClick={closeDrawer}>
                    Dashboard
                  </NavItem>
                  <NavItem to="/favorites" onClick={closeDrawer}>
                    Favorites
                  </NavItem>
                  <NavItem to="/compare" onClick={closeDrawer}>
                    Compare
                  </NavItem>
                  <NavItem to="/messages" onClick={closeDrawer}>
                    Messages
                  </NavItem>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeDrawer();
                    }}
                    className="w-full mt-4 px-5 py-2.5 rounded-lg font-bold text-white bg-gray-800 hover:bg-gray-900 transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Guest View
                <>
                  <NavItem to="/" onClick={closeDrawer}>
                    Home
                  </NavItem>
                  <NavItem to="/tips" onClick={closeDrawer}>
                    Beauty Tips
                  </NavItem>
                  <NavItem to="/subscriptions" onClick={closeDrawer}>
                    Add Your Business
                  </NavItem>
                  <NavItem to="/about" onClick={closeDrawer}>
                    About Us
                  </NavItem>
                  {/* <NavItem to="/contact" onClick={closeDrawer}>
                    Contact
                  </NavItem> */}
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
