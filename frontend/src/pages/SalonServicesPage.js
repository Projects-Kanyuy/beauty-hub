// src/pages/SalonServicesPage.js
import React, { useState, useEffect } from 'react';
import { FaPen, FaTrash, FaSpinner } from 'react-icons/fa';
import Button from '../components/Button';
import ServiceModal from '../components/ServiceModal';
import { fetchMySalon, addService, updateService, deleteService } from '../api';

const SalonServicesPage = () => {
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      const { data } = await fetchMySalon();
      setSalon(data);
      setServices(data.services || []);
    } catch (err) {
      console.error("Failed to load services:", err);
      setError(err.response?.data?.message || "Could not load your services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenModal = (service = null) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(salon._id, serviceId);
        // Refresh the list from the server to ensure consistency
        loadServices();
        alert('Service deleted successfully!');
      } catch (err) {
        console.error("Failed to delete service:", err);
        alert('Error deleting service: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleFormSubmit = async (serviceData) => {
    try {
      if (editingService) {
        // Update existing service
        await updateService(salon._id, editingService._id, serviceData);
        alert('Service updated successfully!');
      } else {
        // Add new service
        await addService(salon._id, serviceData);
        alert('Service added successfully!');
      }
      handleCloseModal();
      // Refresh the list from the server to get the latest data
      loadServices();
    } catch (err) {
      console.error("Failed to save service:", err);
      alert('Error saving service: ' + (err.response?.data?.message || err.message));
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);

  if (loading) return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl text-primary-purple" /></div>;
  if (error) return <div className="bg-red-100 text-red-700 p-6 rounded-lg"><h2 className="font-bold">Error</h2><p>{error}</p></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-main">Manage My Services</h1>
        <Button variant="gradient" onClick={() => handleOpenModal()}>Add New Service</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-4 font-semibold">Service Name</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? services.map(service => (
                <tr key={service._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-text-muted truncate max-w-xs">{service.description}</p>
                  </td>
                  <td className="p-4">{formatPrice(service.price)}</td>
                  <td className="p-4">{service.duration} mins</td>
                  <td className="p-4">
                    <div className="flex space-x-3">
                      <button onClick={() => handleOpenModal(service)} className="text-blue-600 hover:text-blue-800"><FaPen /></button>
                      <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-text-muted">You haven't added any services yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} initialData={editingService} />
    </div>
  );
};

export default SalonServicesPage;