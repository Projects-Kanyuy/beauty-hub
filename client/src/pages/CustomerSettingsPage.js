import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "../components/Button";
import ProfileSection from "../components/ProfileSection"; // Reuse!
import { useAuth } from "../context/AuthContext";

const CustomerSettingsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    console.log("Saving data:", formData);
    toast.success(t("settings.successMessage"));
  };

  if (!user) {
    return (
      <div className="p-16 text-center">
        <FaSpinner className="animate-spin text-4xl mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-4xl space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-text-main">
            {t("settings.accountSettings")}
          </h1>
          <Button variant="gradient" onClick={handleSaveChanges}>
            {t("settings.saveChanges")}
          </Button>
        </div>

        {/* Profile Information Section */}
        <ProfileSection
          title={t("settings.profileInfoTitle")}
          description={t("settings.profileInfoDescription")}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("settings.fullName")}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("settings.emailAddress")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-gray-100"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("settings.emailNotice")}
              </p>
            </div>
          </div>
        </ProfileSection>

        {/* Change Password Section */}
        <ProfileSection
          title={t("settings.changePasswordTitle")}
          description={t("settings.changePasswordDescription")}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("settings.currentPassword")}
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("settings.newPassword")}
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("settings.confirmPassword")}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </ProfileSection>

        {/* Danger Zone */}
        <ProfileSection
          title={t("settings.dangerZoneTitle")}
          description={t("settings.dangerZoneDescription")}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">{t("settings.deleteAccount")}</h3>
              <p className="text-sm text-text-muted">
                {t("settings.deleteAccountDescription")}
              </p>
            </div>
            <Button variant="danger" className="!py-2 !px-4">
              {t("settings.deleteAccount")}
            </Button>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
};

export default CustomerSettingsPage;
