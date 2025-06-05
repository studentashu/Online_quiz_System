import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizManager = ({ quizId, token }) => {
  const [quiz, setQuiz] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', questions: [] });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    if (quizId) {
      axios.get(`/api/quizzes/${quizId}`, { headers })
        .then(res => {
          setQuiz(res.data);
          setFormData(res.data);
        })
        .catch(err => setError(err.response?.data?.message || 'Error loading quiz'));
    }
  }, [quizId]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`/api/quizzes/${quizId}`, formData, { headers });
      setQuiz(res.data.quiz);
      setMessage('Quiz updated successfully');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await axios.delete(`/api/quizzes/${quizId}`, { headers });
      setMessage('Quiz deleted successfully');
      setQuiz(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (!quiz) return <div>{error || 'Loading quiz...'}</div>;

  return (
    <div className="p-4 border rounded-md shadow-sm max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Quiz Manager</h2>

      {editing ? (
        <div>
          <label className="block mb-2">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="border p-2 w-full mb-4"
          />
          {/* Add fields for editing questions if needed */}
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Save
          </button>
          <button onClick={() => setEditing(false)} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold">{quiz.title}</h3>
          <ul className="list-disc ml-5 mt-2">
            {quiz.questions?.map((q, i) => (
              <li key={i}>{q.questionText}</li>
            ))}
          </ul>
          <div className="mt-4">
            <button onClick={() => setEditing(true)} className="bg-yellow-400 px-4 py-2 rounded mr-2">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>
          </div>
        </div>
      )}

      {message && <div className="mt-4 text-green-600">{message}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
};

export default QuizManager;
