// src/components/QuizAttempt.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';          // your axios instance
import { useAuth } from '../context/AuthContext';

export default function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const answersRef = useRef([]);

  useEffect(() => {
    const checkAndFetchQuiz = async () => {
      try {
        const attemptRes = await api.get(`/api/quizzes/${id}/check-attempt`);
        if (attemptRes.data.attempted) {
          alert('❌ You already attempted this quiz in the last 24 hours.');
          navigate('/student/dashboard');
          return;
        }
        const res = await api.get(`/api/quizzes/${id}`);
        setQuiz(res.data);
        const initialAnswers = new Array(res.data.questions.length).fill(null);
        setAnswers(initialAnswers);
        answersRef.current = initialAnswers;
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load quiz");
        navigate('/student/dashboard');
      }
    };

    checkAndFetchQuiz();
  }, [id, navigate]);

  useEffect(() => {
    if (submitted) return;
    if (timeLeft === 0) {
      autoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleChange = (questionIndex, selectedOption) => {
    if (submitted) return;
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = selectedOption;
    setAnswers(updatedAnswers);
    answersRef.current = updatedAnswers;
  };

  const autoSubmit = async () => {
    try {
      const res = await api.post(`/api/quizzes/${id}/answer`, {
        answers: answersRef.current,
        email: user?.email,
      });
      setSubmitted(true);
      setUserScore(res.data.score);
      alert(`⏰ Time’s up!\nYour Score: ${res.data.score} / ${quiz.questions.length}`);
    } catch (err) {
      alert('❌ Failed to auto-submit quiz. Please try again.');
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post(`/api/quizzes/${id}/answer`, {
        answers,
        email: user?.email,
      });
      setSubmitted(true);
      setUserScore(res.data.score);
      alert(`✅ Answers submitted!\nYour Score: ${res.data.score} / ${quiz.questions.length}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('❌ Failed to submit quiz. Please try again.');
    }
  };

  if (!quiz) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header with timer */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-purple-700">{quiz.title}</h2>
        <div className="text-xl font-bold text-pink-600 bg-pink-100 px-4 py-2 rounded-full shadow">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      {/* Questions */}
      {quiz.questions.map((q, idx) => {
        const userAnswer = answers[idx];
        const correctAnswer = q.correctAnswer; // fixed field name

        return (
          <div
            key={idx}
            className="mb-10 p-6 rounded-2xl shadow-xl border border-pink-200 bg-gradient-to-br from-purple-50 to-pink-50"
          >
            <p className="text-xl font-semibold text-purple-900 mb-6">
              {idx + 1}. {q.questionText}
            </p>

            <div className="grid gap-4">
              {q.options.map((opt, optIdx) => {
                const isSelected = userAnswer === optIdx;
                const isCorrect = correctAnswer === optIdx;

                let base =
                  "p-4 rounded-xl border text-base font-medium transition duration-200 flex justify-between items-center";
                let style = "bg-white border-gray-300 text-gray-800 hover:bg-pink-100";
                let label = "";

                if (submitted) {
                  if (isCorrect && isSelected) {
                    style = "bg-green-200 border-green-600 text-green-900 font-semibold";
                    label = "✅ Your Answer (Correct)";
                  } else if (isCorrect && !isSelected) {
                    style = "bg-green-100 border-green-500 text-green-800";
                    label = "✔ Correct Answer";
                  } else if (isSelected && !isCorrect) {
                    style = "bg-red-200 border-red-600 text-red-900";
                    label = "❌ Your Answer";
                  } else {
                    style = "bg-gray-100 border-gray-300 text-gray-500";
                  }
                } else if (isSelected) {
                  style = "bg-purple-100 border-purple-500 text-purple-900";
                }

                return (
                  <label
                    key={optIdx}
                    className={`${base} ${style} cursor-pointer`}
                  >
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={optIdx}
                      checked={isSelected}
                      onChange={() => handleChange(idx, optIdx)}
                      className="hidden"
                      disabled={submitted}
                    />
                    <span>{opt}</span>
                    {submitted && label && (
                      <span className="text-sm italic select-none">{label}</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      {!submitted && (
        <div className="text-center mt-10">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-4 rounded-full shadow-lg transition duration-300 ease-in-out"
          >
            Submit Answers
          </button>
        </div>
      )}

      {userScore !== null && (
        <div className="text-center mt-10 text-2xl font-bold text-green-700">
          🎉 Your Score: {userScore} / {quiz.questions.length}
        </div>
      )}
    </div>
  );
}
