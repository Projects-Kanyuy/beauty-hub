// src/components/PhotoUploader.js
import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const PhotoUploader = ({ photos }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {photos.map((photo, index) => (
      <div key={index} className="relative group">
        <img src={photo} alt={`Salon gallery ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity">
          <button className="text-white opacity-0 group-hover:opacity-100"><FaTrash size={20} /></button>
        </div>
      </div>
    ))}
    <button className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50">
      <FaPlus size={24} />
      <span className="text-sm mt-2">Add Photo</span>
    </button>
  </div>
);

export default PhotoUploader;