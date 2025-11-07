// src/components/SearchBar.js
import React, { useState } from 'react';
import Button from './Button'; // Import our new Button component

// Simple SVG icons for the inputs
const SearchIcon = () => (
    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const LocationIcon = () => (
    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const SearchBar = () => {
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would trigger the search logic
    alert(`Searching for "${service}" in "${location}"`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl mx-auto"
    >
      {/* Service Input */}
      <div className="relative flex-grow w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="Service, salon name..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Location Input */}
      <div className="relative flex-grow w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <LocationIcon />
        </span>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="New York, NY"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Search Button */}
      <Button type="submit">Search</Button>
    </form>
  );
};

export default SearchBar;