// src/components/BlogCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaArrowRight } from 'react-icons/fa';

const BlogCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
      <div className="relative">
        <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute top-4 left-4 bg-primary-pink text-white text-xs font-semibold px-3 py-1.5 rounded-md">{post.category}</span>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-text-muted mb-3">
          <span className="flex items-center space-x-1.5">
            <FaCalendarAlt />
            <span>{post.date}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <FaClock />
            <span>{post.readTime}</span>
          </span>
        </div>
        <h3 className="text-xl font-bold text-text-main mb-3 group-hover:text-primary-purple transition-colors">
          <Link to={`/blog/${post.id}`}>{post.title}</Link>
        </h3>
        <p className="text-text-muted mb-4 text-base">
          {post.excerpt}
        </p>
        <Link to={`/blog/${post.id}`} className="font-semibold text-primary-purple hover:text-primary-pink flex items-center space-x-2">
          <span>Read More</span>
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;