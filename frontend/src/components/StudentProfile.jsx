import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const StudentProfile = () => {
  const { user, loading } = useAuth();
  const baseURL = 'http://localhost:5000'; // Your backend

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      const res = await axios.post(
        `${baseURL}/api/users/update-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      setStatus(res.data.message);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setStatus(
        err.response?.data?.message || 'Failed to update password. Try again.'
      );
    }
  };

  if (loading)
    return <div className="text-purple-600 text-center py-10">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg mt-10 shadow-lg border border-pink-200 mb-16">
      <h1 className="text-2xl font-extrabold text-purple-600 hover:text-indigo-800 tracking-tight text-center">
        Student Dashboard
      </h1>

      {user ? (
        <div className="space-y-6 text-gray-800 mt-8">
          {/* User info */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="font-semibold w-32 text-purple-600">Name:</label>
            <span className="ml-0 md:ml-4 text-purple-700 font-medium">{user.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center">
            <label className="font-semibold w-32 text-purple-600">Email:</label>
            <span className="ml-0 md:ml-4 text-purple-700 font-medium">{user.email}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center">
            <label className="font-semibold w-32 text-purple-600">Role:</label>
            <span className="ml-0 md:ml-4 capitalize text-pink-600 font-semibold">{user.role}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center">
            <label className="font-semibold w-32 text-purple-600">User ID:</label>
            <span className="ml-0 md:ml-4 text-gray-500 font-mono">{user._id || user.userId}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center">
            <label className="font-semibold w-32 text-purple-600">Account Created:</label>
            <span className="ml-0 md:ml-4 text-gray-500">
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Not available'}
            </span>
          </div>

          {user.address && (
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="font-semibold w-32 text-purple-600">Address:</label>
              <span className="ml-0 md:ml-4 text-purple-700">{user.address}</span>
            </div>
          )}

          {user.phoneNumber && (
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="font-semibold w-32 text-purple-600">Phone:</label>
              <span className="ml-0 md:ml-4 text-purple-700">{user.phoneNumber}</span>
            </div>
          )}

          {user.collegeName && (
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="font-semibold w-32 text-purple-600">College:</label>
              <span className="ml-0 md:ml-4 text-purple-700">{user.collegeName}</span>
            </div>
          )}

          {user.collegeId && (
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="font-semibold w-32 text-purple-600">College ID:</label>
              <span className="ml-0 md:ml-4 text-purple-700">{user.collegeId}</span>
            </div>
          )}

          {user.profilePicture && (
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="font-semibold w-32 text-purple-600">Profile Picture:</label>
              <img
                src={`${baseURL}/${user.profilePicture.replace(/\\/g, '/')}`}
                alt="Profile"
                className="ml-0 md:ml-4 w-24 h-24 rounded-full object-cover border shadow-md"
              />
            </div>
          )}

          {user.collegeIdCard && (
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="font-semibold w-32 text-purple-600">College ID Card:</label>
              <img
                src={`${baseURL}/${user.collegeIdCard.replace(/\\/g, '/')}`}
                alt="College ID"
                className="ml-0 md:ml-4 w-40 h-auto object-contain border shadow-md"
              />
            </div>
          )}

          {/* 🔐 Update Password Section */}
          <div className="pt-6">
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded transition duration-200"
            >
              {showPasswordForm ? 'Cancel' : 'Update Password'}
            </button>

            {showPasswordForm && (
              <form onSubmit={handlePasswordUpdate} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-600">Old Password</label>
                  <input
                    type="password"
                    className="w-full border border-purple-300 rounded px-3 py-2"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-600">New Password</label>
                  <input
                    type="password"
                    className="w-full border border-purple-300 rounded px-3 py-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded"
                >
                  Save Password
                </button>
                {status && (
                  <p className="text-sm mt-2 text-center text-purple-700 font-medium">{status}</p>
                )}
              </form>
            )}
          </div>
        </div>
      ) : (
        <p className="text-pink-600 text-center font-semibold">No user data available. Please log in.</p>
      )}
    </div>
  );
};

export default StudentProfile;