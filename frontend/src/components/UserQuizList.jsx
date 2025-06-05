import React, { useEffect, useState } from 'react';
import api from './api';
import { FileText } from 'lucide-react';

export default function UserQuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [attemptedMap, setAttemptedMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/api/quizzes');
        setQuizzes(res.data);

        const attempts = {};
        await Promise.all(
          res.data.map(async (quiz) => {
            try {
              const attemptRes = await api.get(`/api/quizzes/${quiz._id}/check-attempt`);
              attempts[quiz._id] = attemptRes.data.attempted;
            } catch (error) {
              attempts[quiz._id] = false;
            }
          })
        );

        setAttemptedMap(attempts);
      } catch (err) {
        console.error('Error loading quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const openTermsTab = (quizId) => {
  const termsText = `
  1. I confirm that I am the actual person taking this quiz and not impersonating anyone else.
  2. I agree not to use unfair means such as copying, searching online, or seeking external help during the quiz.
  3. I will not take screenshots, record, or share any quiz content with others.
  4. I will not switch tabs or minimize the browser during the quiz, which may be treated as suspicious activity.
  5. I acknowledge that this quiz is being monitored and any suspicious behavior can lead to disqualification.
  6. I agree to complete the quiz within the allowed time and not attempt it more than once.
  7. I understand that failure to comply with these terms may lead to disciplinary action including a ban from future quizzes.
  `;

  const newTab = window.open('', '_blank');
  newTab.document.write(`
    <html>
      <head>
        <title>Quiz Terms & Conditions</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(to bottom right, #fff0f5, #f0e6ff);
            padding: 40px;
            color: #333;
          }
          .container {
            max-width: 700px;
            margin: auto;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            padding: 30px;
          }
          h2 {
            text-align: center;
            font-size: 28px;
            margin-bottom: 20px;
            color: #b83280;
          }
          pre {
            background: #f9f9f9;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 10px;
            max-height: 300px;
            overflow-y: auto;
            white-space: pre-wrap;
            font-size: 14px;
            line-height: 1.6;
          }
          label {
            display: flex;
            align-items: center;
            margin-top: 20px;
            font-size: 15px;
            gap: 10px;
          }
          input[type="checkbox"] {
            transform: scale(1.2);
          }
          button {
            margin-top: 25px;
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          button.disabled {
            background-color: #ccc;
            color: #777;
            cursor: not-allowed;
          }
          button.enabled {
            background: linear-gradient(to right, #ec4899, #d946ef);
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Quiz Terms & Conditions</h2>
          <pre>${termsText}</pre>

          <label>
            <input type="checkbox" id="agreeBox" />
            I agree to the Terms & Conditions
          </label>

          <button id="takeQuizBtn" class="disabled" disabled>Take Quiz</button>
        </div>

        <script>
          const checkbox = document.getElementById('agreeBox');
          const button = document.getElementById('takeQuizBtn');

          checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
              button.disabled = false;
              button.classList.remove('disabled');
              button.classList.add('enabled');
            } else {
              button.disabled = true;
              button.classList.remove('enabled');
              button.classList.add('disabled');
            }
          });

          button.addEventListener('click', () => {
            window.open('/student/quiz/${quizId}', '_blank');
            window.close();
          });
        </script>
      </body>
    </html>
  `);

  newTab.document.close();
};


  if (loading) return <div className="text-center mt-10">Loading quizzes...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-fuchsia-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-fuchsia-600 to-purple-700 bg-clip-text text-transparent mb-12">
          Available Quizzes
        </h2>

        {quizzes.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No quizzes available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white/60 backdrop-blur-md border border-pink-200 shadow-2xl rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="text-fuchsia-600 w-6 h-6" />
                  <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{quiz.description || 'No description'}</p>

                {attemptedMap[quiz._id] ? (
                  <button
                    className="w-full text-center bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg cursor-not-allowed"
                    disabled
                  >
                    Attempted (Wait 24 hrs)
                  </button>
                ) : (
                  <button
                    onClick={() => openTermsTab(quiz._id)}
                    className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-pink-500 text-white font-semibold px-4 py-2 rounded-lg"
                  >
                    Start Test
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
