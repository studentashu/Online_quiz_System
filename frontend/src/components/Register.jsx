import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    collegeId: '',
    collegeName: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [collegeIdCard, setCollegeIdCard] = useState(null);

  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  const { name } = e.target;

  if (!file) return;

  const fileSizeKB = file.size / 1024; // Convert bytes to kilobytes

  if (name === 'profilePicture') {
    if (fileSizeKB < 50 || fileSizeKB > 250) {
      setError('Profile Picture must be between 50KB and 250KB');
      setProfilePicture(null);
      return;
    }
    setError('');
    setProfilePicture(file);
  } else if (name === 'collegeIdCard') {
    if (fileSizeKB < 100 || fileSizeKB > 500) {
      setError('College ID Card must be between 100KB and 500KB');
      setCollegeIdCard(null);
      return;
    }
    setError('');
    setCollegeIdCard(file);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (profilePicture) data.append('profilePicture', profilePicture);
    if (collegeIdCard) data.append('collegeIdCard', collegeIdCard);

    try {
      const res = await api.post('/api/users/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      setMessage(res.data.message || 'Registered successfully');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-1">Student Registration</h1>
        <p className="text-center text-sm text-gray-600 mb-6">Join nDMatrix Online Examination Portal</p>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Create Your Account</h2>
        <p className="text-sm text-center text-gray-500 mb-8">Please fill in all required information</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number *"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg"
          />
          <input
            type="text"
            name="collegeId"
            placeholder="College ID Number *"
            value={formData.collegeId}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg"
          />
          <textarea
            name="collegeName"
            placeholder="College Name *"
            value={formData.collegeName}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg col-span-1 md:col-span-2"
          />

          {/* File Uploads */}
          <div className="col-span-1">
            <label className="text-sm text-gray-600 block mb-1">Profile Picture * (50KB–250KB)</label>
            <div className="border border-dashed rounded-lg p-3 text-center text-sm text-gray-500">
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label className="text-sm text-gray-600 block mb-1">College ID Card * (100KB–500KB)</label>
            <div className="border border-dashed rounded-lg p-3 text-center text-sm text-gray-500">
              <input
                type="file"
                name="collegeIdCard"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="col-span-2 flex justify-between items-center mt-6">
            <button
              type="button"
              className="px-6 py-3 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-700 transition"
            >
              Register
            </button>
          </div>
        </form>

        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Register;