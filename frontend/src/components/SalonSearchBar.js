// src/components/SalonSearchBar.js
import React from 'react';
import { FaSearch, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import Button from './Button';

const FilterPill = ({ children, active }) => (
  <button className={`px-4 py-2 text-sm font-semibold rounded-full border ${active ? 'bg-primary-purple text-white border-primary-purple' : 'bg-white text-text-muted border-gray-300 hover:border-gray-400'}`}>
    {children}
  </button>
);

const SalonSearchBar = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search salons, services, or locations..." className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple" />
        </div>
        {/* Location Input */}
        <div className="relative flex-grow">
          <FaMapMarkerAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Douala" className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple" />
        </div>
        <Button variant="gradient" className="!py-3">Search</Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <FilterPill active>All</FilterPill>
        <FilterPill>Braiding</FilterPill>
        <FilterPill>Natural Hair</FilterPill>
        <FilterPill>Nails</FilterPill>
        <FilterPill>Spa & Facials</FilterPill>
        <FilterPill>Makeup</FilterPill>
        <button className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-full border bg-white text-text-muted border-gray-300 hover:border-gray-400">
          <FaFilter />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
};

export default SalonSearchBar;