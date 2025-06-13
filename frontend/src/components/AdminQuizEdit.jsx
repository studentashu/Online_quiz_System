import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";
 
const emptyQuestion = () => ({
  text: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
});
 
const AdminQuizEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [questions, setQuestions] = useState([]);
 
  useEffect(() => {
    fetchQuiz();
  }, [id]);
 
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/quizzes/${id}`);
 
      setQuiz(res.data);
 
      const qs = Array.isArray(res.data.questions) ? res.data.questions : [];
 
      const transformedQs = qs.map((q) => ({
        text: q.questionText || "",
        options: q.options || ["", "", "", ""],
        correctOptionIndex: q.correctAnswer ?? 0,
      }));
 
      setQuestions(transformedQs);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };
 
  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  };
 
  const deleteQuestion = (index) => {
    if (!window.confirm("Delete this question?")) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };
 
  const updateQuestionText = (index, text) => {
    setQuestions((prev) => {
      const newQs = [...prev];
      newQs[index].text = text;
      return newQs;
    });
  };
 
  const updateOptionText = (qIndex, optionIndex, text) => {
    setQuestions((prev) => {
      const newQs = [...prev];
      newQs[qIndex].options[optionIndex] = text;
      return newQs;
    });
  };
 
  const updateCorrectOption = (qIndex, correctIndex) => {
    setQuestions((prev) => {
      const newQs = [...prev];
      newQs[qIndex].correctOptionIndex = correctIndex;
      return newQs;
    });
  };
 
  const saveQuestions = async () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`Question ${i + 1} text cannot be empty`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        alert(`All options in question ${i + 1} must be filled`);
        return;
      }
    }
 
    const questionsToSave = questions.map((q) => ({
      questionText: q.text,
      options: q.options,
      correctAnswer: q.correctOptionIndex,
    }));
 
    try {
      await api.put(`/api/quizzes/${id}`, { questions: questionsToSave });
      alert("Questions saved successfully");
      navigate("/admin/quizzes");
    } catch {
      alert("Failed to save questions");
    }
  };
 
  if (loading)
    return (
      <p className="p-6 text-center text-gray-500 text-lg italic">Loading quiz...</p>
    );
  if (error)
    return (
      <p className="p-6 text-center text-red-600 font-semibold text-lg">{error}</p>
    );
 
  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-tr from-white to-blue-50 rounded-xl shadow-2xl">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gradient bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
        Edit Questions for: {quiz.title}
      </h1>
 
      {questions.map((q, i) => (
        <div
          key={i}
          className="mb-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold text-gray-800">
              Question {i + 1}
            </h2>
            <button
              onClick={() => deleteQuestion(i)}
              className="text-red-600 hover:text-red-800 transition-colors duration-200 font-semibold focus:outline-none"
              aria-label={`Delete question ${i + 1}`}
              title={`Delete question ${i + 1}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-5 py-3 mb-6 text-lg font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 resize-none shadow-sm transition"
            rows={4}
            placeholder="Enter question text"
            value={q.text}
            onChange={(e) => updateQuestionText(i, e.target.value)}
          />
 
          <div>
            <h3 className="mb-3 font-semibold text-gray-700 tracking-wide">
              Options (mark correct one):
            </h3>
            {q.options.map((opt, optIndex) => (
              <div
                key={optIndex}
                className="flex items-center mb-4 space-x-4"
              >
                <input
                  type="radio"
                  name={`correctOption-${i}`}
                  checked={q.correctOptionIndex === optIndex}
                  onChange={() => updateCorrectOption(i, optIndex)}
                  className="w-6 h-6 text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded-lg px-4 py-2 text-lg font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 shadow-sm transition"
                  placeholder={`Option ${optIndex + 1}`}
                  value={opt}
                  onChange={(e) => updateOptionText(i, optIndex, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
 
      <div className="mb-12 text-center">
        <button
          onClick={addQuestion}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-shadow duration-300 font-semibold shadow-lg shadow-indigo-300/50 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          aria-label="Add new question"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          + Add New Question
        </button>
      </div>
 
      <div className="text-center">
        <button
          onClick={saveQuestions}
          className="inline-block bg-green-600 text-white px-10 py-4 rounded-2xl hover:bg-green-700 transition-shadow duration-300 font-extrabold shadow-2xl shadow-green-400/50 focus:outline-none focus:ring-4 focus:ring-green-400"
          aria-label="Save questions"
        >
          Save Questions
        </button>
      </div>
    </div>
  );
};
 
export default AdminQuizEdit;