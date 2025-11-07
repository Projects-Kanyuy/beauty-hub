// src/components/ProfileSection.js
import React from 'react';

const ProfileSection = ({ title, description, children }) => {
  return (
    // Main container with a white background, padding, rounded corners, and a subtle shadow.
    <div className="bg-white p-6 rounded-lg shadow-sm">
      
      {/* The main title of the section, e.g., "Basic Information" */}
      <h2 className="text-xl font-bold text-text-main">{title}</h2>
      
      {/* The descriptive text that appears below the title */}
      <p className="text-sm text-text-muted mb-6">{description}</p>
      
      {/* A light gray divider line for visual separation */}
      <div className="border-t border-gray-200 pt-6">
        
        {/* 'children' is a special prop in React. It renders whatever content
            you place *inside* the <ProfileSection> tags on the main page. */}
        {children}

      </div>
    </div>
  );
};

export default ProfileSection;