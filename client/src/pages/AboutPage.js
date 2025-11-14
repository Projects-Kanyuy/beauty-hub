// src/pages/AboutPage.js
import React from 'react';
import { FaBullseye, FaUsers, FaHandsHelping } from 'react-icons/fa';
import aboutHeroImage from '../assets/about-hero.jpg'; // Add a relevant hero image to /assets

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-cover bg-center" style={{ backgroundImage: `url(${aboutHeroImage})` }}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 container mx-auto text-center text-white">
          <h1 className="text-5xl font-extrabold mb-4">About BeautyHub</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Connecting beauty professionals and clients across Africa with trust and technology.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-text-main mb-4">Our Mission</h2>
            <p className="text-text-muted mb-4">
              Our mission is to empower beauty entrepreneurs by providing a robust platform to showcase their talents, manage their business, and connect with a wider audience. We aim to simplify the process for clients to discover, book, and review beauty services, ensuring a seamless and trustworthy experience for everyone.
            </p>
            <p className="text-text-muted">
              We believe in the power of community and strive to build a supportive ecosystem where beauty professionals can thrive and clients can find the perfect match for their needs.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <FaBullseye className="text-4xl text-primary-purple mx-auto mb-3" />
                <h3 className="font-bold text-lg">Empowerment</h3>
                <p className="text-sm text-text-muted">Lifting up local businesses.</p>
              </div>
              <div className="bg-pink-50 p-6 rounded-lg text-center">
                <FaUsers className="text-4xl text-primary-pink mx-auto mb-3" />
                <h3 className="font-bold text-lg">Community</h3>
                <p className="text-sm text-text-muted">Building strong connections.</p>
              </div>
              <div className="bg-pink-50 p-6 rounded-lg text-center">
                 <FaHandsHelping className="text-4xl text-primary-pink mx-auto mb-3" />
                <h3 className="font-bold text-lg">Trust</h3>
                <p className="text-sm text-text-muted">Verified and authentic reviews.</p>
              </div>
               <div className="bg-purple-50 p-6 rounded-lg text-center">
                <FaBullseye className="text-4xl text-primary-purple mx-auto mb-3" />
                <h3 className="font-bold text-lg">Quality</h3>
                <p className="text-sm text-text-muted">Highlighting the best talent.</p>
              </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section. */}
       <section className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-main mb-4">Join Our Growing Platform</h2>
          <p className="text-text-muted mb-8 max-w-2xl mx-auto">Whether you're looking for your next beauty treatment or want to grow your salon business, BeautyHub is here for you.</p>
          <div className="flex justify-center gap-4">
             <a href="/explore" className="px-8 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-primary-pink to-primary-purple hover:opacity-90 transition-opacity">Explore Salons</a>
             <a href="/add-salon" className="px-8 py-3 rounded-lg font-bold bg-white border-2 border-gray-300 text-text-main hover:bg-gray-100 transition-colors">List Your Business</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;