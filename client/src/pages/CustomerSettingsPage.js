// src/pages/CustomerSettingsPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ProfileSection from '../components/ProfileSection'; // Reuse!
import Button from '../components/Button';
import { FaSpinner } from 'react-icons/fa';

const CustomerSettingsPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Pre-fill the form with user data when the component loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    // In a real app, you would make API calls here to update the user profile and password.
    // For now, we just show a success toast.
    console.log("Saving data:", formData);
    toast.success("Settings saved successfully!");
  };

  // If user data hasn't loaded yet, show a loading state
  if (!user) {
    return <div className="p-16 text-center"><FaSpinner className="animate-spin text-4xl mx-auto" /></div>;
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-4xl space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-text-main">Account Settings</h1>
          <Button variant="gradient" onClick={handleSaveChanges}>Save Changes</Button>
        </div>

        {/* Profile Information Section */}
        <ProfileSection title="Profile Information" description="Manage your personal details.">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md bg-gray-100" readOnly />
              <p className="text-xs text-gray-500 mt-1">Your email is used for login and cannot be changed.</p>
            </div>
          </div>
        </ProfileSection>

        {/* Change Password Section */}
        <ProfileSection title="Change Password" description="For your security, we recommend using a strong password.">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Current Password</label>
              <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">New Password</label>
              <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
          </div>
        </ProfileSection>
        
        {/* Danger Zone */}
        <ProfileSection title="Danger Zone" description="Be careful, these actions are not reversible.">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold">Delete Account</h3>
                    <p className="text-sm text-text-muted">Permanently delete your account and all associated data.</p>
                </div>
                <Button variant="danger" className="!py-2 !px-4">Delete Account</Button>
            </div>
        </ProfileSection>
      </div>
    </div>
  );
};

export default CustomerSettingsPage;