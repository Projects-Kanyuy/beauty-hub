// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark-footer text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About & Socials */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-extrabold mb-4">BeautyHeaven</h3>
            <p className="text-gray-400 max-w-md mb-6">
              Your trusted platform to discover and connect with the best beauty
              professionals across Africa. Find top-rated salons, nail artists,
              and beauty specialists near you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-white">
                  Add Your Business
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white">
                  Beauty Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/cookie" className="hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} BeautyHeaven. All rights reserved.
          </p>
          <a
            href="mailto:support@beautyheaven.site"
            target={"_blank"}
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-green-400 hover:text-white mt-4 sm:mt-0"
          >
            {/* <FaWhatsapp size={20} />
            <span>WhatsApp Support: +237 6XX XXX XXX</span> */}
            <FaEnvelope size={20} />
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
