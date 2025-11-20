// src/components/SalonOwnerLayout.js
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarAlt, FaStore, FaConciergeBell, FaCommentDots, FaStar, FaChartLine, FaCog } from 'react-icons/fa';

const SidebarLink = ({ to, icon: Icon, children }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-purple text-white' : 'text-gray-200 hover:bg-purple-800'}`
    }
  >
    <Icon size={20} />
    <span className="font-semibold">{children}</span>
  </NavLink>
);

const SalonOwnerLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 hidden lg:block">
        <Link to="/" className="text-3xl font-extrabold mb-8 block">
          <span className="bg-gradient-to-r from-primary-pink to-primary-purple text-transparent bg-clip-text">
            BeautyHeaven
          </span>
          <span className="text-xs font-semibold text-gray-400 ml-2">OWNER PORTAL</span>
        </Link>
        <nav className="space-y-2">
          <SidebarLink to="/salon-owner/dashboard" icon={FaTachometerAlt}>Dashboard</SidebarLink>
          <SidebarLink to="/salon-owner/appointments" icon={FaCalendarAlt}>Appointments</SidebarLink>
          <SidebarLink to="/salon-owner/profile" icon={FaStore}>My Salon Profile</SidebarLink>
          <SidebarLink to="/salon-owner/services" icon={FaConciergeBell}>Services</SidebarLink>
          <SidebarLink to="/salon-owner/messages" icon={FaCommentDots}>Messages</SidebarLink>
          <SidebarLink to="/salon-owner/reviews" icon={FaStar}>Reviews</SidebarLink>
          <SidebarLink to="/salon-owner/analytics" icon={FaChartLine}>Analytics</SidebarLink>
          <SidebarLink to="/salon-owner/settings" icon={FaCog}>Settings</SidebarLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* We can add a simple top bar here if needed in the future */}
        <main className="p-8">
          {children} {/* This is where the specific page content (like the dashboard) will go */}
        </main>
      </div>
    </div>
  );
};

export default SalonOwnerLayout;