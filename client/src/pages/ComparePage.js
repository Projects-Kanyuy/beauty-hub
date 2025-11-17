// src/pages/ComparePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { mockSalons, mockUserCompareList } from '../data/mockData';
import { FaStar } from 'react-icons/fa';
import { GoGitCompare } from "react-icons/go";
import Button from '../components/Button';

const ComparePage = () => {
  const salonsToCompare = mockSalons.filter(salon => mockUserCompareList.includes(salon.id));

  // A list of features to compare. This makes the layout easier to manage.
  const features = [
    { label: 'Rating', key: 'rating' },
    { label: 'Reviews', key: 'reviewCount' },
    { label: 'Starting Price', key: 'startingPrice' },
    { label: 'Response Time', key: 'responseTime' },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-text-main">Compare Salons</h1>
          <p className="text-lg text-text-muted mt-4">
            See how your top choices stack up side-by-side.
          </p>
        </div>
        
        {salonsToCompare.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <div className={`grid grid-cols-${salonsToCompare.length + 1} min-w-[800px]`}>
              {/* Feature Labels Column */}
              <div className="font-bold text-text-main border-r border-gray-200">
                <div className="p-4 h-56 sticky top-0"></div> {/* Spacer for image */}
                {features.map(feature => (
                  <div key={feature.label} className="p-4 border-t border-gray-200">{feature.label}</div>
                ))}
                <div className="p-4 border-t border-gray-200"></div> {/* Spacer for button */}
              </div>

              {/* Salon Columns */}
              {salonsToCompare.map(salon => (
                <div key={salon.id} className="border-r border-gray-200 text-center">
                  <div className="p-4 h-56">
                    <img src={salon.imageUrl} alt={salon.name} className="w-full h-full object-cover rounded-md" />
                    <h3 className="font-bold text-lg mt-2">{salon.name}</h3>
                  </div>
                  {features.map(feature => (
                    <div key={feature.label} className="p-4 border-t border-gray-200 text-text-muted">
                      {feature.key === 'rating' && <FaStar className="inline mr-1 text-yellow-400" />}
                      {salon[feature.key]}
                    </div>
                  ))}
                   <div className="p-4 border-t border-gray-200">
                      <Button variant="gradient" className="w-full !py-2">Book Now</Button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <GoGitCompare className="text-5xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-main">Nothing to Compare</h2>
            <p className="text-text-muted mt-2 mb-6">Add salons to your compare list to see them here.</p>
            <Link to="/" className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-primary-pink to-primary-purple hover:opacity-90 transition-opacity">
              Explore Salons
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;