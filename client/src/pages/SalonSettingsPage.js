import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { updateUserProfile } from "../api";
import Button from "../components/Button";
import ProfileSection from "../components/ProfileSection";
import { useAuth } from "../context/AuthContext";

const Toggle = ({ label, enabled, onChange }) => (
  <div className="flex justify-between items-center">
    <span className="font-medium">{label}</span>
    <button
      onClick={onChange}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
        enabled ? "bg-primary-purple" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const SalonSettingsPage = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    newBooking: true,
    newReview: true,
    newMessage: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSaveChanges = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error(t("salonsettings.passwordMismatch"));
    }

    const dataToUpdate = { name: formData.name };
    if (formData.password) dataToUpdate.password = formData.password;

    setIsSaving(true);
    try {
      const { data: updatedUser } = await updateUserProfile(dataToUpdate);
      login({ ...updatedUser, token: updatedUser.token });
      toast.success(t("salonsettings.saved"));
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || t("salonsettings.saveError"));
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="p-16 text-center">
        <FaSpinner className="animate-spin text-4xl mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-main">
          {t("salonsettings.header")}
        </h1>
        <Button
          variant="gradient"
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving
            ? t("salonsettings.saving")
            : t("salonsettings.saveChanges")}
        </Button>
      </div>

      <ProfileSection
        title={t("salonsettings.accountInfo")}
        description={t("salonsettings.accountInfoDesc")}
      >
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t("salonsettings.fullName")}
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
              {t("salonsettings.email")}
            </label>
            <input
              type="email"
              value={formData.email}
              className="w-full p-2 border rounded-md bg-gray-100"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t("salonsettings.newPassword")}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("salonsettings.passwordPlaceholder")}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t("salonsettings.confirmPassword")}
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

      <ProfileSection
        title={t("salonsettings.notifications")}
        description={t("salonsettings.notificationsDesc")}
      >
        <div className="space-y-4 max-w-md">
          <Toggle
            label={t("salonsettings.newBooking")}
            enabled={notifications.newBooking}
            onChange={() =>
              setNotifications((n) => ({ ...n, newBooking: !n.newBooking }))
            }
          />
          <Toggle
            label={t("salonsettings.newReview")}
            enabled={notifications.newReview}
            onChange={() =>
              setNotifications((n) => ({ ...n, newReview: !n.newReview }))
            }
          />
          <Toggle
            label={t("salonsettings.newMessage")}
            enabled={notifications.newMessage}
            onChange={() =>
              setNotifications((n) => ({ ...n, newMessage: !n.newMessage }))
            }
          />
        </div>
      </ProfileSection>
    </div>
  );
};

export default SalonSettingsPage;
