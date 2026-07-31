import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  LogOut 
} from 'lucide-react';

const Settings = () => {
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // 1. Personal Info state
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    role: ''
  });

  // 2. Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserStr = localStorage.getItem('user');

        if (storedUserStr) {
          const parsedUser = JSON.parse(storedUserStr);
          
          setPersonalInfo({
            fullName: parsedUser.name || 'User Name',
            email: parsedUser.email || 'No Email Found (Please Re-login)', 
            role: parsedUser.role || 'Executive'
          });
        } else {
          setPersonalInfo({
            fullName: 'Guest User',
            email: 'not-logged-in@example.com',
            role: 'Guest'
          });
        }
      } catch (storageError) {
        console.error("Error parsing localStorage user data", storageError);
      }
    };
    
    fetchUserData();
  }, []);

  // Submit Password Modification to Backend Database Authentication Router
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match!' });
      return;
    }

    try {
      await api.put('/auth/update-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setStatus({ type: 'success', message: 'Password updated successfully in database!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to update user authentication credentials.' 
      });
    }
  };

  // Trigger Logout routine clearing authorization headers tokens
  const handleLogoutAction = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#2B3542] text-white rounded-md">
        <h1 className="text-sm font-bold tracking-wide">
          Account Settings
        </h1>
      </div>

      {/* Alert Notification */}
      {status.message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium border flex items-center justify-between transition-all duration-300 shadow-sm ${
            status.type === 'success'
              ? 'bg-emerald-50  border-emerald-200  text-emerald-800 '
              : 'bg-rose-50  border-rose-200  text-rose-800 '
          }`}
        >
          <span>{status.message}</span>
          <button
            onClick={() => setStatus({ type: '', message: '' })}
            className="text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Personal Information Card Container */}
      <div className="bg-white   rounded-2xl border border-slate-100  p-6 shadow-sm space-y-6 transition-colors">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 ">
          <div className="p-3 bg-indigo-50  text-indigo-600 rounded-xl">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 ">Personal Information</h2>
            <p className="text-xs text-slate-400 mt-0.5">Your core user account profile data</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500  mb-2">
                Full Name (Read-Only)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  disabled
                  value={personalInfo.fullName || 'Loading Profile...'}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50  border border-slate-200  rounded-xl text-slate-500  cursor-not-allowed font-medium outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500  mb-2">
                Email Address (Read-Only)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  disabled
                  value={personalInfo.email || 'Loading Email...'}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50  border border-slate-200  rounded-xl text-slate-500  cursor-not-allowed font-medium outline-none transition-colors"
                />
              </div>
            </div>

            {/* Account Role */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500  mb-2">
                Account Role (Read-Only)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Shield size={18} />
                </span>
                <input
                  type="text"
                  disabled
                  value={personalInfo.role || 'Admin'}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50  border border-slate-200  rounded-xl text-slate-500  cursor-not-allowed font-medium outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Password Modification Accordion Form Container */}
          {showPasswordSection && (
            <form onSubmit={handlePasswordUpdate} className="mt-6 pt-6 border-t border-slate-100  space-y-4 bg-slate-50/50  p-5 rounded-xl border  transition-colors">
              <h3 className="text-sm font-bold text-slate-800  flex items-center gap-2">
                <Lock size={16} /> Change System Login Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500  mb-2">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full bg-white   border border-slate-200  rounded-xl py-2.5 px-4 text-sm text-slate-800  focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium placeholder-slate-400 "
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500  mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-white   border border-slate-200  rounded-xl py-2.5 px-4 text-sm text-slate-800  focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium placeholder-slate-400 "
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500  mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-white   border border-slate-200  rounded-xl py-2.5 px-4 text-sm text-slate-800  focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium placeholder-slate-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(false)}
                  className="px-4 py-2.5 border border-slate-200  bg-white  rounded-xl text-xs font-semibold text-slate-600  hover:bg-slate-50  transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Update DB Password
                </button>
              </div>
            </form>
          )}

          <hr className="border-slate-100  my-5 transition-colors" />

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1.5"
            >
              <Lock size={16} />
              {showPasswordSection ? 'Hide Password Panel' : 'Change Password?'}
            </button>
            <button
              type="button"
              onClick={handleLogoutAction}
              className="text-sm font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;