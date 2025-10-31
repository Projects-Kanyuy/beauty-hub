// src/pages/FavoritesPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { mockSalons, mockUserFavorites } from '../data/mockData';
import SalonCard from '../components/SalonCard'; // We reuse our great SalonCard component!
import { FaHeartBroken } from 'react-icons/fa';

const FavoritesPage = () => {
  // Filter the full list of salons to get only the favorited ones
  const favoriteSalons = mockSalons.filter(salon => mockUserFavorites.includes(salon.id));

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-text-main">My Favorites</h1>
          <p className="text-lg text-text-muted mt-4">
            Your saved salons, all in one place.
          </p>
        </div>

        {favoriteSalons.length > 0 ? (
          // If there are favorites, show them in a grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteSalons.map(salon => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          // If there are no favorites, show an "empty state" message
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <FaHeartBroken className="text-5xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-main">No Favorites Yet</h2>
            <p className="text-text-muted mt-2 mb-6">
              Click the heart icon on any salon to save it here.
            </p>
            <Link to="/explore" className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-primary-pink to-primary-purple hover:opacity-90 transition-opacity">
              Explore Salons
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;