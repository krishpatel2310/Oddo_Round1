import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Helper Icons for a richer UI ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 3c4.532 0 8.34-2.296 9-5.344a12.02 12.02 0 00-2.382-9.628z" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;

// --- Main Settings Page Component ---

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Get user data from localStorage and calculate profile completion
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setProfileForm({ name: userData.name || '', email: userData.email || '' });
      setLoading(false);
    } else {
      setError('User data not found');
      setLoading(false);
    }
  }, [navigate]);

  // Calculate profile completion percentage
  const getProfileCompletion = () => {
    if (!user) return 0;
    let completion = 0;
    if (user.name) completion += 50;
    if (user.email) completion += 50;
    return completion;
  };

  // Handle profile update (localStorage only since backend endpoint doesn't exist)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Update user data in localStorage (local update only)
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditingProfile(false);
      alert('Profile updated locally! Note: Changes will be lost on login.');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  // Handle password change (placeholder - backend endpoint doesn't exist)
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // Since backend doesn't have password change endpoint, show message
    alert('Password change feature is not yet implemented in the backend. Please contact support.');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading user data</p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* User Details Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=E0E7FF&color=4338CA&size=128`} 
              alt="Profile" 
              className="h-24 w-24 rounded-full border-4 border-gray-200"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-gray-800">{user.name || 'User'}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-400 mt-1">
                Joined on {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="sm:ml-auto flex flex-col space-y-2 pt-4 sm:pt-0">
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </button>
              <button 
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                Change Password
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditingProfile && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h3>
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <strong>Note:</strong> Profile changes are stored locally and will revert when you log in again.
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Change Password Form */}
        {isChangingPassword && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <strong>Note:</strong> Password change functionality is not yet implemented in the backend.
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  minLength="6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  minLength="6"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Account Information */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Profile Completion */}
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600"><UserIcon /></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Profile Completion</h4>
                <p className="text-sm text-gray-500 mb-2">Complete your profile for better experience.</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${getProfileCompletion()}%` }}></div>
                </div>
                <p className="text-right text-xs font-medium text-green-600 mt-1">{getProfileCompletion()}% Complete</p>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><ShieldCheckIcon /></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Account Security</h4>
                <p className="text-sm text-gray-500">Keep your account secure with strong passwords.</p>
                <p className="text-xs text-gray-400 mt-1">Last login: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Update
              </button>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-600"><BellIcon /></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Transaction History</h4>
                <p className="text-sm text-gray-500">View and manage your transaction history.</p>
              </div>
              <button 
                onClick={() => navigate('/expencehistory')}
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                View All
              </button>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Session Management</h4>
                <p className="text-sm text-gray-500">Logout from your account when done.</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Logout
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;