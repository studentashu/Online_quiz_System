import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from './api';
import { Calendar, Clock } from 'lucide-react';

const Results = () => {
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get(`/api/quizzes/results/${encodeURIComponent(user.email)}`, {
          withCredentials: true,
        });

        setResults(response.data);
      } catch (err) {
        setError('Failed to fetch results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  if (authLoading) return <div>Checking authentication...</div>;
  if (!user) return <div>Please log in to view your results.</div>;
  if (loading) return <div>Loading results...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (results.length === 0) return <div>No results found yet.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Test Results</h2>
      <p className="text-gray-500 mb-10">Track your progress and performance</p>

      <div className="space-y-6">
        {results.map((result) => {
          const total = result.totalMarks || 100;
          const percentage = ((result.score / total) * 100).toFixed(1);
          const date = new Date(result.createdAt);
          const formattedDate = date.toLocaleDateString();
          const duration = result.quiz?.duration || 120; // fallback to 120 mins
          const participants = result.quiz?.participants || '---';

          return (
            <div
              key={result._id}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-200"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {result.quiz?.title || 'Untitled Quiz'}
                </h3>
                <p className="text-sm text-blue-600 font-medium">GATE CS 2025</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {duration} minutes
                  </span>
                  <span>Participants: {participants}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">SCORE</p>
                  <p className="text-xl font-bold text-blue-600">
                    {result.score}/{total}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">PERCENTAGE</p>
                  <p className="text-xl font-bold text-green-600">{percentage}%</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">RANK</p>
                  <p className="text-xl font-bold text-purple-600">
                    #{result.rank || '--'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;