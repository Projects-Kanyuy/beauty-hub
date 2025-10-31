// src/pages/SalonSettingsPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../api';
import { toast } from 'react-toastify';
import ProfileSection from '../components/ProfileSection';
import Button from '../components/Button';
import { FaSpinner } from 'react-icons/fa';

const Toggle = ({ label, enabled, onChange }) => (
  <div className="flex justify-between items-center">
    <span className="font-medium">{label}</span>
    <button onClick={onChange} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-primary-purple' : 'bg-gray-300'}`}>
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const SalonSettingsPage = () => {
  const { user, login } = useAuth(); // We need `login` to update the user in context
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [notifications, setNotifications] = useState({ newBooking: true, newReview: true, newMessage: false });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }

    const dataToUpdate = { name: formData.name };
    if (formData.password) {
      dataToUpdate.password = formData.password;
    }

    setIsSaving(true);
    try {
      const { data: updatedUser } = await updateUserProfile(dataToUpdate);
      // We "re-login" the user with the new data. This updates the context and localStorage with the new token.
      login({ ...updatedUser, token: updatedUser.token }); 
      toast.success("Settings saved successfully!");
      // Clear password fields after successful save
      setFormData(prev => ({...prev, password: '', confirmPassword: ''}));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div className="p-16 text-center"><FaSpinner className="animate-spin text-4xl mx-auto" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-main">Settings</h1>
        <Button variant="gradient" onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <ProfileSection title="Account Information" description="Manage your login email and password.">
        <div className="space-y-4 max-w-md">
          <div><label className="block text-sm font-semibold mb-1">Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
          <div><label className="block text-sm font-semibold mb-1">Login Email</label><input type="email" value={formData.email} className="w-full p-2 border rounded-md bg-gray-100" readOnly /></div>
          <div><label className="block text-sm font-semibold mb-1">New Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" className="w-full p-2 border rounded-md" /></div>
          <div><label className="block text-sm font-semibold mb-1">Confirm New Password</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
        </div>
      </ProfileSection>

      <ProfileSection title="Notification Preferences" description="Choose how you want to be notified.">
        <div className="space-y-4 max-w-md">
          <Toggle label="Email for new booking" enabled={notifications.newBooking} onChange={() => setNotifications(n => ({...n, newBooking: !n.newBooking}))} />
          <Toggle label="Email for new review" enabled={notifications.newReview} onChange={() => setNotifications(n => ({...n, newReview: !n.newReview}))} />
          <Toggle label="Email for new message" enabled={notifications.newMessage} onChange={() => setNotifications(n => ({...n, newMessage: !n.newMessage}))} />
        </div>
      </ProfileSection>
    </div>
  );
};
export default SalonSettingsPage;