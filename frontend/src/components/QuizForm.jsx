// frontend/src/components/QuizForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function QuizForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [natAnswer, setNatAnswer] = useState('');

  const navigate = useNavigate();

  const addQuestion = () => {
    if (!questionText.trim()) {
      alert('Question text is required.');
      return;
    }

    if (questionType === 'MCQ') {
      if (options.some(opt => !opt.trim())) {
        alert('All options must be filled.');
        return;
      }

      setQuestions(prev => [
        ...prev,
        { type: 'MCQ', questionText, options, correctAnswer: parseInt(correctAnswer) }
      ]);
    } else {
      if (natAnswer.trim() === '' || isNaN(natAnswer)) {
        alert('Please enter a valid numerical answer.');
        return;
      }

      setQuestions(prev => [
        ...prev,
        { type: 'NAT', questionText, answer: parseInt(natAnswer) }
      ]);
    }

    // Reset fields
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setNatAnswer('');
    setQuestionType('MCQ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Title and Description are required.');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question.');
      return;
    }

    try {
      await api.post('/api/quizzes/', { title, description, questions });
      alert('🎉 Quiz created successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to create quiz. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-sm">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">📝 Create New Quiz</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Quiz Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Description <span className="text-red-500">*</span></label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-500"
            rows={3}
            required
          />
        </div>

        <div className="bg-gray-50 p-4 border rounded space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Add Question</h3>

          <div>
            <label className="block font-semibold mb-1">Question Type</label>
            <select
              value={questionType}
              onChange={e => setQuestionType(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="MCQ">MCQ</option>
              <option value="NAT">NAT (Numerical Answer Type)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-sm">Question <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          {questionType === 'MCQ' ? (
  <>
    <label className="block font-medium text-sm">Options <span className="text-red-500">*</span></label>
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChange={e => {
            const newOptions = [...options];
            newOptions[idx] = e.target.value;
            setOptions(newOptions);
          }}
          className="p-3 border rounded focus:outline-none focus:ring focus:border-blue-500"
        />
      ))}
    </div>

    <div className="mt-3">
      <label className="block font-semibold">Correct Answer <span className="text-red-500">*</span></label>
      <select
        value={correctAnswer}
        onChange={e => setCorrectAnswer(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
      >
        {options.map((opt, i) => (
          <option key={i} value={i}>
            Option {i + 1}: {opt || `Option ${i + 1}`}
          </option>
        ))}
      </select>
    </div>
  </>
) : (
  <div>
    <label className="block font-semibold">Correct Answer (Integer) <span className="text-red-500">*</span></label>
    <input
      type="number"
      value={natAnswer}
      onChange={e => setNatAnswer(e.target.value)}
      className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
)}

          <button
            type="button"
            onClick={addQuestion}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            ➕ Add Question
          </button>
        </div>

        {questions.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h4 className="text-lg font-bold text-gray-800 mb-3">📚 Questions Preview</h4>
            <ul className="space-y-3">
              {questions.map((q, idx) => (
                <li key={idx} className="p-3 border rounded bg-gray-50">
                  <strong>Q{idx + 1}:</strong> {q.questionText}
                  {q.type === 'MCQ' ? (
                    <ul className="ml-5 mt-1 list-disc text-sm text-gray-700">
                      {q.options.map((opt, i) => (
                        <li key={i} className={i === q.correctAnswer ? 'font-semibold text-green-700' : ''}>
                          {opt} {i === q.correctAnswer && '(Correct)'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-5 text-sm text-blue-700 mt-1">Answer: <strong>{q.answer}</strong></p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded text-lg transition"
        >
          ✅ Submit Quiz
        </button>
      </form>
    </div>
  );
}
