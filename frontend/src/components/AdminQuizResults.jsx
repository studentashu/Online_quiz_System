import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';

export default function AdminQuizResults() {
  const { id } = useParams(); // quiz ID from URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/api/quizzes/${id}/results`);
        setResults(res.data);
      } catch (err) {
        alert('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-lg">Loading results...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Quiz Results</h2>
      {results.length === 0 ? (
        <p className="text-gray-500">No submissions found for this quiz.</p>
      ) : (
        <table className="w-full border shadow rounded-lg overflow-hidden">
          <thead className="bg-purple-100 text-purple-900">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">College Name</th>
              <th className="p-3 text-left">College ID</th>
              <th className="p-3 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res, idx) => (
              <tr key={res._id} className="border-t hover:bg-purple-50">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{res.user?.name || 'N/A'}</td>
                <td className="p-3">{res.user?.email || 'N/A'}</td>
                <td className="p-3">{res.user?.collegeName || 'N/A'}</td>
                <td className="p-3">{res.user?.collegeId || 'N/A'}</td>
                <td className="p-3 font-semibold text-green-700">{res.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}