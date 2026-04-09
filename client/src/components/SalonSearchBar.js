import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const SalonSearchBar = () => {
  const [term, setTerm] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to the Salons Page with the search query in the URL
    if (term.trim() || location.trim()) {
      navigate(`/salons?keyword=${term}&location=${location}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-[2rem] shadow-xl border border-gray-100 max-w-5xl mx-auto">
      <div className="flex-1 flex items-center px-6 py-3 border-r border-gray-100">
        <FaSearch className="text-purple-400 mr-3" />
        <input 
          type="text" 
          placeholder="Search salons, services..." 
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full outline-none font-medium text-gray-700" 
        />
      </div>
      <div className="flex-1 flex items-center px-6 py-3">
        <FaMapMarkerAlt className="text-purple-400 mr-3" />
        <input 
          type="text" 
          placeholder="Location (City)" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full outline-none font-medium text-gray-700" 
        />
      </div>
      <button 
        type="submit"
        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-[1.5rem] font-black hover:scale-105 transition-transform shadow-lg"
      >
        Search
      </button>
    </form>
  );
};

export default SalonSearchBar;