import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaSpinner, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import { useMySalon } from "../api/swr";
import { createSalon, updateMySalon } from "../api";
import { toast } from "react-toastify";
import Button from "../components/Button";

const SalonProfilePage = () => {
  const { t } = useTranslation();
  const { data: salon, isLoading, mutate } = useMySalon();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    currency: "XAF", // Default
  });

  useEffect(() => {
    if (salon) {
      setFormData({
        name: salon.name || "",
        description: salon.description || "",
        address: salon.address || "",
        city: salon.city || "",
        phone: salon.phone || "",
        currency: salon.currency || "XAF",
      });
    }
  }, [salon]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (salon) {
        await updateMySalon(salon._id, formData);
        toast.success("Profile Updated!");
      } else {
        await createSalon(formData);
        toast.success("Salon Profile Created!");
      }
      mutate();
    } catch (err) {
      toast.error("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><FaSpinner className="animate-spin text-4xl text-primary-purple" /></div>;

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900">My Salon Profile</h1>
        <p className="text-gray-500 mt-2">Setup your business identity and local currency.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-white shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Salon Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none" />
            </div>
            {/* --- NEW CURRENCY SELECTOR --- */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Local Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold">
                <option value="XAF">Cameroon/Gabon (XAF)</option>
                <option value="NGN">Nigeria (NGN)</option>
                <option value="GHS">Ghana (GHS)</option>
                <option value="USD">International (USD)</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Business Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none" />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-white shadow-sm">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><FaMapMarkerAlt className="text-blue-500" /> Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none" />
            <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none" />
          </div>
        </div>

        <Button type="submit" disabled={loading} variant="gradient" className="w-full !py-5 text-xl rounded-full shadow-lg">
          {loading ? <FaSpinner className="animate-spin" /> : "Save Profile"}
        </Button>
      </form>
    </div>
  );
};

export default SalonProfilePage;