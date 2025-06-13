import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';
import { useAuth } from '../context/AuthContext';
import "./QuizAttempt.css";
function NumericKeypad({ value, onChange, disabled }) {
  const appendDigit = (digit) => {
    if (disabled) return;
    if (digit === '.' && value?.includes('.')) return;
    onChange((value ?? '') + digit);
  };

  const backspace = () => {
    if (disabled) return;
    onChange((value ?? '').slice(0, -1));
  };

  const clear = () => {
    if (disabled) return;
    onChange('');
  };

  return (
    <div className="numeric-keypad grid grid-cols-3 gap-2 w-full max-w-md mx-auto mt-4">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'].map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => {
            if (key === '←') backspace();
            else appendDigit(key);
          }}
          disabled={disabled}
          className="py-2 px-3 text-lg border rounded-md hover:bg-gray-100 transition-all disabled:opacity-50"
        >
          {key}
        </button>
      ))}
      <button
        type="button"
        onClick={clear}
        disabled={disabled}
        className="col-span-3 py-2 px-3 text-lg border rounded-md hover:bg-gray-100 transition-all disabled:opacity-50"
      >
        Clear
      </button>
    </div>
  );
}



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
        const initialAnswers = new Array(res.data.questions?.length || 0).fill(null);
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

  const handleChange = (questionIndex, value) => {
    if (submitted) return;
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = value;
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

  if (!quiz.questions || quiz.questions.length === 0) {
    return <div className="text-center mt-10 text-lg text-red-600">No questions found for this quiz.</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-purple-700">{quiz.title}</h2>
        <div className="text-xl font-bold text-pink-600 bg-pink-100 px-4 py-2 rounded-full shadow">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      {quiz.questions.map((q, idx) => {
        const userAnswer = answers[idx];
        const correctAnswer = q.correctAnswer;
        const type = (q.type || 'mcq').toLowerCase();

        return (
          <div
            key={idx}
            className="mb-10 p-6 rounded-2xl shadow-xl border border-pink-200 bg-gradient-to-br from-purple-50 to-pink-50"
          >
            <p className="text-xl font-semibold text-purple-900 mb-6">
              {idx + 1}. {q.questionText}
            </p>

            {type === 'mcq' ? (
              <div className="grid gap-4">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isCorrect = correctAnswer === optIdx;

                  let base = "p-4 rounded-xl border text-base font-medium transition duration-200 flex justify-between items-center";
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
                    <label key={optIdx} className={`${base} ${style} cursor-pointer`}>
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
            ) : (<div className="flex flex-col gap-2">
  <input
    type="text"
    placeholder="Enter your answer"
    value={userAnswer ?? ''}
    disabled={submitted}
    readOnly
    className="w-64 px-4 py-2 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
  />
  <NumericKeypad
    value={userAnswer ?? ''}
    onChange={(val) => handleChange(idx, val)}
    disabled={submitted}
  />
  {submitted && (
    <p className="text-sm mt-1">
     {Number(userAnswer) === Number(q.answer) ? (
  <span className="text-green-700 font-semibold">✅ Correct Answer</span>
) : (
  <>
    <span className="text-red-600 font-semibold">
      ❌ Wrong Answer: {userAnswer || 'N/A'}
    </span>
    <br />
    <span className="text-purple-700">✔ Correct Answer: {q.answer}</span>
  </>
)}

    </p>
  )}
</div>

            )}
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
