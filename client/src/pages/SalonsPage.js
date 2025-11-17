import React from 'react';
import { useState, useEffect } from 'react';
import { fetchSalons } from '../api';
import SalonCard from '../components/SalonCard';
import { FaSpinner, FaSearch, FaFilter, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const SalonsPage = () => {
  const [salons, setSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique locations from salons
  const locations = salons.length > 0 
    ? ['all', ...new Set(salons.map(s => s.location || 'Unknown'))]
    : ['all'];

  useEffect(() => {
    const getSalons = async () => {
      try {
        setLoading(true);
        const { data } = await fetchSalons();
        setSalons(data);
        setFilteredSalons(data);
      } catch (err) {
        console.error("Failed to fetch salons:", err);
        setError('Failed to load salons. The server might be unavailable.');
      } finally {
        setLoading(false);
      }
    };

    getSalons();
  }, []);

  // Filter salons based on search and filters
  useEffect(() => {
    let filtered = salons;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(salon =>
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (salon.description && salon.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(salon => salon.location === selectedLocation);
    }

    // Rating filter
    if (selectedRating !== 'all') {
      const minRating = parseInt(selectedRating);
      filtered = filtered.filter(salon => (salon.rating || 0) >= minRating);
    }

    setFilteredSalons(filtered);
  }, [searchQuery, selectedRating, selectedLocation, salons]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRating('all');
    setSelectedLocation('all');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">All Salons</h1>
          <p className="text-slate-300 text-lg">Discover and book from {salons.length} amazing salons</p>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="bg-slate-50 border-b sticky top-0 z-40 py-4 px-4">
        <div className="container mx-auto">
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search salons by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <FaFilter /> Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location === 'all' ? 'All Locations' : location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                >
                  <option value="all">All Ratings</option>
                  <option value="1">1+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(searchQuery || selectedRating !== 'all' || selectedLocation !== 'all') && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center gap-2 bg-primary-purple text-white px-3 py-1 rounded-full text-sm">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="hover:opacity-75">×</button>
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="inline-flex items-center gap-2 bg-primary-purple text-white px-3 py-1 rounded-full text-sm">
                  <FaMapMarkerAlt /> {selectedLocation}
                  <button onClick={() => setSelectedLocation('all')} className="hover:opacity-75">×</button>
                </span>
              )}
              {selectedRating !== 'all' && (
                <span className="inline-flex items-center gap-2 bg-primary-purple text-white px-3 py-1 rounded-full text-sm">
                  <FaStar /> {selectedRating}+ Stars
                  <button onClick={() => setSelectedRating('all')} className="hover:opacity-75">×</button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Salons Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
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
          ) : filteredSalons.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 p-8 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-gray-700">No Salons Found</h3>
              <p className="text-text-muted mt-2">Try adjusting your search or filters</p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-6 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-pink transition-colors font-medium"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-text-muted">
                Showing <span className="font-semibold text-text-main">{filteredSalons.length}</span> of <span className="font-semibold text-text-main">{salons.length}</span> salons
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSalons.map(salon => (
                  <SalonCard key={salon._id} salon={salon} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default SalonsPage;
