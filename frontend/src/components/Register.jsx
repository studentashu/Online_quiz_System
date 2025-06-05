import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    address: '',
    phoneNumber: '',
    collegeName: '',
    collegeId: '',
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
    if (e.target.name === 'profilePicture') {
      setProfilePicture(e.target.files[0]);
    } else if (e.target.name === 'collegeIdCard') {
      setCollegeIdCard(e.target.files[0]);
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
      setFormData({
        name: '',
        email: '',
        role: 'student',
        address: '',
        phoneNumber: '',
        collegeName: '',
        collegeId: '',
      });
      setProfilePicture(null);
      setCollegeIdCard(null);

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 shadow-2xl rounded-3xl w-full max-w-md m-auto border border-blue-300">
        <h2 className="text-2xl font-semibold text-center text-blue-800 mb-6">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="text"
            name="collegeName"
            placeholder="College Name"
            value={formData.collegeName}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="text"
            name="collegeId"
            placeholder="College ID"
            value={formData.collegeId}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <label className="block text-sm text-gray-600">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-xl"
          />

          <label className="block text-sm text-gray-600">College ID Card</label>
          <input
            type="file"
            name="collegeIdCard"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
