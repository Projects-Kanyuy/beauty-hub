import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createSalon, updateMySalon } from "../api";
import { useActiveSubscription, useMySalon } from "../api/swr";
import AlertBox from "../components/AlertBox";
import Button from "../components/Button";
import PhotoUploader from "../components/PhotoUploader";
import ProfileSection from "../components/ProfileSection";
import { useAuth } from "../context/AuthContext";

const blankProfile = {
  name: "",
  description: "",
  phone: "",
  email: "",
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
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const {
    data: salonData,
    error: salonError,
    isLoading: loadingSalon,
    mutate: mutateSalon,
  } = useMySalon();
  const {
    data: subscriptionData,
    isLoading: loadingSubscription,
  } = useActiveSubscription(user?._id);
  const hasActiveSubscription = !!subscriptionData?.data;

  const isEditMode = profile && profile._id;

  useEffect(() => {
    if (salonData) {
      setProfile(salonData);
      setError(null);
      return;
    }

    if (salonError) {
      if (salonError.response?.status === 404) {
        setProfile(blankProfile);
        setError(null);
      } else {
        console.error("Failed to load profile:", salonError);
        setError(
          salonError.response?.data?.message || t("salonprofile.loadFailed")
        );
      }
    }
  }, [salonData, salonError, t]);

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
      openingHours: { ...prev.openingHours, [day]: value },
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
        mutateSalon(updatedProfile, false);
        toast.success(t("salonprofile.updatedSuccess"));
      } else {
        const { data } = await createSalon(profile);
        const createdSalon = data?.salon || profile;
        setProfile(createdSalon);
        mutateSalon(createdSalon, false);
        toast.success(t("salonprofile.createdSuccess"));
        setTimeout(() => navigate("/salon-owner/dashboard"), 2000);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error(err.response?.data?.message || t("salonprofile.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingSalon || loadingSubscription)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );
  if (!hasActiveSubscription)
    return (
      <AlertBox
        title={t("salondashboard.noSubscription")}
        message={t("salonprofile.subscriptionRequired")}
        type="warning"
        actionLabel={t("salondashboard.choosePlan")}
        actionLink="/subscriptions"
      />
    );

  if (error)
    return (
      <AlertBox
        title={t("salonprofile.errorTitle")}
        message={error}
        type="error"
        onRetry={() => window.location.reload()}
      />
    );

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-main">
          {isEditMode
            ? t("salonprofile.editTitle")
            : t("salonprofile.createTitle")}
        </h1>
        <Button variant="gradient" onClick={handleSave} disabled={isSaving}>
          {isSaving
            ? t("salonprofile.saving")
            : isEditMode
            ? t("salonprofile.saveChanges")
            : t("salonprofile.createProfile")}
        </Button>
      </div>

      <ProfileSection
        title={t("salonprofile.basicInfoTitle")}
        description={t("salonprofile.basicInfoDesc")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label={t("salonprofile.salonName")}
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
          <InputField
            label={t("salonprofile.phone")}
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
          <InputField
            label={t("salonprofile.email")}
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-text-main mb-1">
              {t("salonprofile.description")}
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
        title={t("salonprofile.photoGalleryTitle")}
        description={t("salonprofile.photoGalleryDesc")}
      >
        <PhotoUploader
          photos={profile.photos || []}
          onPhotosChange={handlePhotosChange}
        />
      </ProfileSection>

      <ProfileSection
        title={t("salonprofile.locationTitle")}
        description={t("salonprofile.locationDesc")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label={t("salonprofile.address")}
            name="address"
            value={profile.address}
            onChange={handleChange}
          />
          <InputField
            label={t("salonprofile.city")}
            name="city"
            value={profile.city}
            onChange={handleChange}
          />
        </div>
      </ProfileSection>

      <ProfileSection
        title={t("salonprofile.openingHoursTitle")}
        description={t("salonprofile.openingHoursDesc")}
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
