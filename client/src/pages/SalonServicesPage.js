import React, { useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSpinner, FaStoreAlt } from "react-icons/fa";
import { useMySalon } from "../api/swr";
import { addService, updateService, deleteService } from "../api";
import { toast } from "react-toastify";
import Button from "../components/Button";
import ServiceModal from "../components/ServiceModal";
import { useNavigate } from "react-router-dom";

const SalonServicesPage = () => {
  const navigate = useNavigate();
  const { data: salonData, isLoading, mutate } = useMySalon();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleFormSubmit = async (serviceData) => {
    if (!salonData?._id) return toast.error("Create profile first.");

    const payload = {
      ...serviceData,
      currency: salonData.currency || "XAF" 
    };

    try {
      if (editingService) {
        await updateService(salonData._id, editingService._id, payload);
      } else {
        await addService(salonData._id, payload);
      }
      mutate();
      setIsModalOpen(false);
      setEditingService(null);
      toast.success("Service Saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save service");
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><FaSpinner className="animate-spin text-4xl text-primary-purple" /></div>;

  if (!salonData) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FaStoreAlt className="text-gray-200 text-7xl mb-6" />
        <h2 className="text-3xl font-bold tracking-tighter">Setup Required</h2>
        <p className="text-gray-500 mb-8">Please complete your salon profile first.</p>
        <Button onClick={() => navigate("/salon-owner/profile")} variant="gradient" className="rounded-full px-12">Setup Profile</Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Manage Services</h1>
        <Button onClick={() => { setEditingService(null); setIsModalOpen(true); }} className="flex items-center gap-2 rounded-full">
          <FaPlus /> Add New Service
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-white shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F7] text-[10px] font-black uppercase tracking-widest text-gray-400">
            <tr>
              <th className="p-6">Service Name</th>
              <th className="p-6">Price</th>
              <th className="p-6">Duration</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {salonData.services?.map((service) => (
              <tr key={service._id} className="hover:bg-gray-50/50 transition-all">
                <td className="p-6 font-bold">{service.name}</td>
                <td className="p-6 font-black text-primary-purple">{service.price} {service.currency}</td>
                <td className="p-6 text-gray-500 text-sm">{service.duration} mins</td>
                <td className="p-6 text-right">
                  <button onClick={() => { setEditingService(service); setIsModalOpen(true); }} className="p-2 text-blue-500"><FaEdit /></button>
                  <button onClick={() => deleteService(salonData._id, service._id).then(() => mutate())} className="p-2 text-red-400"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit} initialData={editingService} />}
    </div>
  );
};

export default SalonServicesPage;