// src/components/AdminUploadExcel.js
import React, { useState } from 'react';
import axios from 'axios';
import api from './api'; // Adjust the import path as necessary

const AdminUploadExcel = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload-users-excel", formData);
      setMessage(`Users uploaded: ${res.data.users.join(", ")}`);
    } catch (err) {
      console.error(err);
      setMessage("Error uploading file");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow text-center">
      <h2 className="text-lg font-semibold mb-2">Upload Users via Excel</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default AdminUploadExcel;