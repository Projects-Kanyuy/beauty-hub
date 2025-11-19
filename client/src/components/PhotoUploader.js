import React, { useRef } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const PhotoUploader = ({ photos = [], onPhotosChange }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        onPhotosChange([...photos, event.target.result]);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const handleRemovePhoto = (index) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="relative group">
          <img 
            src={photo || "/placeholder.svg"} 
            alt={`Salon gallery ${index + 1}`} 
            className="w-full h-32 object-cover rounded-md" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity rounded-md">
            <button 
              onClick={() => handleRemovePhoto(index)}
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              type="button"
            >
              <FaTrash size={20} />
            </button>
          </div>
        </div>
      ))}
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
        type="button"
      >
        <FaPlus size={24} />
        <span className="text-sm mt-2">Add Photo</span>
      </button>

      <input 
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default PhotoUploader;
