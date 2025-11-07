// src/pages/BeautyTipsPage.js
import React from 'react';
import BlogCard from '../components/BlogCard';
import Button from '../components/Button';
import { mockBlogPosts } from '../data/mockData';

const BeautyTipsPage = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main">Beauty Tips & Trends</h1>
          <p className="text-lg text-text-muted mt-4 max-w-3xl mx-auto">
            Discover the rich beauty traditions of Cameroon, from ancient natural remedies to modern styling
            techniques that celebrate our diverse cultural heritage.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="secondary">
            View All Articles
          </Button>
        </div>

      </div>
    </div>
  );
};

export default BeautyTipsPage;