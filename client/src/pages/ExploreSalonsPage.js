// src/pages/ExploreSalonsPage.js
import React from 'react';
import { useState, useEffect } from 'react';
import SalonSearchBar from '../components/SalonSearchBar';
import SalonCard from '../components/SalonCard';
import { fetchSalons } from '../api';
import { FaSpinner } from 'react-icons/fa';
import { BsGridFill, BsList } from 'react-icons/bs';

const ExploreSalonsPage = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSalons = async () => {
      try {
        setLoading(true);
        // Fetch the list of salons from the backend API
        const { data } = await fetchSalons();
        setSalons(data);
      } catch (err) {
        console.error("Failed to fetch salons:", err);
        setError('Failed to load salons. The server might be unavailable.');
      } finally {
        setLoading(false);
      }
    };

    getSalons();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and Filters Bar */}
        <SalonSearchBar />

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-center my-6">
          <div>
            <h2 className="text-2xl font-bold text-text-main">All Salons</h2>
            {/* Dynamically show the number of salons found */}
            <p className="text-sm text-text-muted">Showing {salons.length} of {salons.length} salons</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple">
              <option>Sort by: Highest Rated</option>
              <option>Sort by: Most Reviewed</option>
            </select>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-primary-purple text-white" title="Grid View"><BsGridFill /></button>
              <button className="p-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:bg-gray-100" title="List View"><BsList /></button>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC CONTENT RENDERING --- */}
        {loading ? (
          <div className="text-center py-20">
            <FaSpinner className="text-5xl text-primary-purple mx-auto animate-spin" />
            <p className="mt-4 font-semibold text-text-muted">Loading Salons...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600 bg-red-50 p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">An Error Occurred</h3>
            <p>{error}</p>
          </div>
        ) : salons.length === 0 ? (
          <div className="text-center py-20 bg-white p-8 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">No Salons Found</h3>
            <p className="text-text-muted">There are currently no salons listed. Be the first to add one!</p>
          </div>
        ) : (
          // --- THIS IS THE CORRECTED GRID LAYOUT ---
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {salons.map(salon => (
              <SalonCard key={salon._id} salon={salon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreSalonsPage;