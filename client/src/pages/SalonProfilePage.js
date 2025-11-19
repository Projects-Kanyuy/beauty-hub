// src/pages/SalonProfilePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMySalon, updateMySalon, createSalon } from "../api";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import ProfileSection from "../components/ProfileSection";
import PhotoUploader from "../components/PhotoUploader";
import Button from "../components/Button";

// A blank template for when a user is creating a new profile
const blankProfile = {
  name: "",
  description: "",
  phone: "",
  email: "", // You might want to pre-fill this with the user's login email
  address: "",
  city: "",
  photos: [],
  openingHours: {
    monday: "09:00 AM - 07:00 PM",
    tuesday: "09:00 AM - 07:00 PM",
    wednesday: "09:00 AM - 07:00 PM",
    thursday: "09:00 AM - 07:00 PM",
    friday: "09:00 AM - 07:00 PM",
    saturday: "10:00 AM - 06:00 PM",
    sunday: "Closed",
  },
};

// A simple helper component for input fields to keep the main form clean
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-text-main mb-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple"
    />
  </div>
);

const SalonProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const isEditMode = profile && profile._id;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const { data } = await fetchMySalon();
        setProfile(data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setProfile(blankProfile);
        } else {
          console.error("Failed to load profile:", err);
          setError(
            err.response?.data?.message || "Could not load your salon profile."
          );
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotosChange = (updatedPhotos) => {
    setProfile((prev) => ({ ...prev, photos: updatedPhotos }));
  };

  const handleHoursChange = (day, value) => {
    setProfile((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      if (isEditMode) {
        const { data: updatedProfile } = await updateMySalon(
          profile._id,
          profile
        );
        setProfile(updatedProfile);
        toast.success("Profile updated successfully!");
      } else {
        await createSalon(profile);
        toast.success(
          "Profile created successfully! Redirecting to dashboard..."
        );
        setTimeout(() => navigate("/salon-owner/dashboard"), 2000);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error(err.response?.data?.message || "Error saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );
  if (error)
    return (
      <div className="bg-red-100 text-red-700 p-6 rounded-lg">
        <h2 className="font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  if (!profile) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-main">
          {isEditMode ? "Edit My Salon Profile" : "Create Your Salon Profile"}
        </h1>
        <Button variant="gradient" onClick={handleSave} disabled={isSaving}>
          {isSaving
            ? "Saving..."
            : isEditMode
            ? "Save Changes"
            : "Create Profile"}
        </Button>
      </div>

      <ProfileSection
        title="Basic Information"
        description="This is the main information that will be displayed on your public salon page."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Salon Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
          <InputField
            label="Phone Number"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
          <InputField
            label="Business Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-text-main mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={profile.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple"
            />
          </div>
        </div>
      </ProfileSection>

      <ProfileSection
        title="Photo Gallery"
        description="Upload high-quality images of your salon, your work, and your team."
      >
        <PhotoUploader
          photos={profile.photos || []}
          onPhotosChange={handlePhotosChange}
        />
      </ProfileSection>

      <ProfileSection
        title="Location"
        description="Help customers find you easily."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Address"
            name="address"
            value={profile.address}
            onChange={handleChange}
          />
          <InputField
            label="City"
            name="city"
            value={profile.city}
            onChange={handleChange}
          />
        </div>
      </ProfileSection>

      <ProfileSection
        title="Opening Hours"
        description="Let customers know when you are open."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.openingHours &&
            Object.entries(profile.openingHours).map(([day, value]) => (
              <div key={day}>
                <label className="block text-sm font-semibold capitalize text-text-main mb-1">
                  {day}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleHoursChange(day, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}
        </div>
      </ProfileSection>
    </div>
  );
};

export default SalonProfilePage;
