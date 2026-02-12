// src/components/ServiceModal.js
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";
import Button from "./Button";

const ServiceModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { t } = useTranslation(); //  translation hook
  const [service, setService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  // This effect pre-fills the form when we are editing a service
  useEffect(() => {
    if (initialData) {
      setService(initialData);
    } else {
      // Reset form when adding a new service
      setService({ name: "", description: "", price: "", duration: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(service);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {initialData
              ? t("serviceModal.editService")
              : t("serviceModal.addService")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t("serviceModal.serviceName")}
            </label>
            <input
              name="name"
              value={service.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t("serviceModal.description")}
            </label>
            <textarea
              name="description"
              value={service.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("serviceModal.price")}
              </label>
              <input
                type="number"
                name="price"
                value={service.price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("serviceModal.duration")}
              </label>
              <input
                type="number"
                name="duration"
                value={service.duration}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              {t("serviceModal.cancel")}
            </Button>
            <Button type="submit" variant="gradient">
              {t("serviceModal.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
