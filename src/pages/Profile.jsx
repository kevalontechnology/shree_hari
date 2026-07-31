import React from 'react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin User', email: 'admin@example.com', role: 'Administrator' };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">My Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white flex items-center justify-center font-bold text-5xl shadow-md">
            {user?.name?.charAt(0).toUpperCase() || 'V'}
          </div>
          <span className="mt-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {user?.role || 'Admin'}
          </span>
        </div>
        
        <div className="flex-grow w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium">
                {user?.name || 'Vrushali'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium">
                {user?.email || 'admin@shreehari.com'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium">
                {user?.phoneNumber || 'Not Provided'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Branch</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium">
                {user?.branch || 'Main Branch'}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
