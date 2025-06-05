import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllQuizAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/admin/quiz-answers', { withCredentials: true })
      .then(res => {
        setAnswers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching quiz answers:', err);
        setError('Failed to load quiz answers.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading quiz answers...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2>All Quiz Answers</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Quiz</th>
            <th>Score</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {answers.map(answer => (
            <tr key={answer._id}>
              <td>{answer.user?.name || 'N/A'} ({answer.user?.email || 'N/A'})</td>
              <td>{answer.quiz?.title || 'N/A'}</td>
              <td>{answer.score}</td>
              <td>{new Date(answer.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllQuizAnswers;
