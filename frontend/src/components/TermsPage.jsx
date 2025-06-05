import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';

export default function TermsPage() {
  const { quizId } = useParams();
  const [agreed, setAgreed] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');

  useEffect(() => {
    const fetchQuizTitle = async () => {
      try {
        const res = await api.get(`/api/quizzes/${quizId}`);
        setQuizTitle(res.data.title);
      } catch (err) {
        console.error('Quiz not found');
      }
    };
    fetchQuizTitle();
  }, [quizId]);

  const handleTakeQuiz = () => {
    window.open(`/student/quiz/${quizId}`, '_blank');
  };

  const termsText = `1. I confirm that I am the actual person taking this quiz and not impersonating anyone else.
2. I agree not to use unfair means such as copying, searching online, or seeking external help during the quiz.
3. I will not take screenshots, record, or share any quiz content with others.
4. I will not switch tabs or minimize the browser during the quiz, which may be treated as suspicious activity.
5. I acknowledge that this quiz is being monitored and any suspicious behavior can lead to disqualification.
6. I agree to complete the quiz within the allowed time and not attempt it more than once.
7. I understand that failure to comply with these terms may lead to disciplinary action including a ban from future quizzes.`;

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-fuchsia-700">
          Terms and Conditions for "{quizTitle}"
        </h1>
        <div className="border border-gray-300 bg-gray-50 rounded-md p-5 text-sm text-gray-700 whitespace-pre-wrap mb-4 max-h-[400px] overflow-y-auto">
          {termsText}
        </div>
        <label className="flex items-center gap-2 text-sm mb-6">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          I agree to the terms and conditions.
        </label>
        <button
          onClick={handleTakeQuiz}
          disabled={!agreed}
          className={`w-full text-center font-semibold px-4 py-2 rounded-lg ${
            agreed
              ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-pink-500 text-white'
              : 'bg-gray-300 text-gray-700 cursor-not-allowed'
          }`}
        >
          Take Quiz
        </button>
      </div>
    </div>
  );
}
