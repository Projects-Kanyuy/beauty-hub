import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  FaTimes, 
  FaTrash, 
  FaSpinner, 
  FaCloudUploadAlt, 
  FaImages, 
  FaCheckCircle 
} from "react-icons/fa";
import { uploadToCloudinary } from "../utils/upload";
import { toast } from "react-toastify";
import Button from "./Button";

const ServiceModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  
  // State initialization
  const [service, setService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    photos: [] 
  });

  useEffect(() => {
    if (initialData) {
      setService({ ...initialData, photos: initialData.photos || [] });
    } else {
      setService({ name: "", description: "", price: "", duration: "", photos: [] });
    }
  }, [initialData, isOpen]);

  // --- FIXED UPLOAD LOGIC ---
  const handleUploadGallery = async (e) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    setIsUploading(true);
    const newImages = [];

    try {
      // Use for...of to correctly await each Cloudinary upload
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        if (url) {
          newImages.push(url);
        }
      }

      if (newImages.length > 0) {
        // Update state so previews show immediately
        setService(prev => ({
          ...prev,
          photos: [...(prev.photos || []), ...newImages]
        }));
        toast.success(`${newImages.length} images added to gallery`);
      } else {
        // If 0, it means Cloudinary rejected the files (Check preset or cloud name)
        toast.error("Upload failed: Cloudinary rejected the files. Check F12 console.");
      }
      
    } catch (error) {
      console.error("Gallery Upload Process Error:", error);
      toast.error('Process failed. Please try again.');
    } finally {
      setIsUploading(false);
      e.target.value = null; // Clear input so you can re-select same files
    }
  };

  const removeImage = (indexToRemove) => {
    setService(prev => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? t("serviceModal.editService") : t("serviceModal.addService")}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(service); }} className="space-y-5">
          {/* Inputs */}
          <div>
            <label className="block text-gray-700 mb-1 font-bold text-sm">{t("serviceModal.serviceName")}</label>
            <input 
              value={service.name} 
              onChange={e => setService({...service, name: e.target.value})} 
              className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary-purple" 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-bold text-sm">{t("serviceModal.description")}</label>
            <textarea 
              value={service.description} 
              onChange={e => setService({...service, description: e.target.value})} 
              rows="2" 
              className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary-purple resize-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-bold text-sm">{t("serviceModal.price")}</label>
              <input 
                type="number" 
                value={service.price} 
                onChange={e => setService({...service, price: e.target.value})} 
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-bold text-sm">{t("serviceModal.duration")}</label>
              <input 
                value={service.duration} 
                onChange={e => setService({...service, duration: e.target.value})} 
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none" 
                required 
              />
            </div>
          </div>

          {/* --- GALLERY SECTION (Mirrored from CarList) --- */}
          <div className="border-t pt-4">
            <label className="block text-gray-700 mb-3 font-bold text-sm flex items-center gap-2">
              <FaImages className="text-blue-500"/> {t("salondetail.gallery")}
            </label>
            
            {/* Gallery Preview Grid */}
            {service.photos && service.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {service.photos.map((img, index) => (
                  <div key={index} className="relative h-24 w-full bg-gray-100 rounded-2xl border-2 border-white shadow-sm overflow-hidden group">
                    <img 
                      src={img} 
                      alt={`Preview ${index}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-white/90 p-0.5 rounded-full">
                       <FaCheckCircle className="text-green-500 text-[10px]" />
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <label className="cursor-pointer flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-gray-300 rounded-[2rem] text-gray-400 hover:bg-gray-50 hover:border-primary-purple hover:text-primary-purple transition-all">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <FaSpinner className="animate-spin text-2xl mb-2 text-primary-purple" />
                  <span className="text-xs font-bold text-gray-500">Uploading...</span>
                </div>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-3xl"/>
                  <span className="text-sm font-bold">Click to add multiple photos</span>
                </>
              )}
              <input 
                type="file" 
                multiple 
                onChange={handleUploadGallery} 
                className="hidden" 
                accept="image/*"
              />
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 px-6 border border-gray-200 rounded-full font-bold text-gray-500 hover:bg-gray-50 transition-all">
              {t("serviceModal.cancel")}
            </button>
            <Button 
              type="submit" 
              variant="gradient" 
              disabled={isUploading} 
              className="flex-1 rounded-full shadow-lg !py-3"
            >
              {t("serviceModal.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;