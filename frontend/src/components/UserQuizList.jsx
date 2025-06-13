import React, { useEffect, useState } from 'react';
import api from './api';
import { FileText, Users, BarChart } from 'lucide-react';

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

  const newWindow = window.open('', '_blank', 'width=800,height=600');

  newWindow.document.write(`
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
            window.open('/student/quiz/${quizId}', '_blank', 'width=2000,height=700');
            window.close();
          });
        </script>
      </body>
    </html>
  `);

  newWindow.document.close();
};

  if (loading) return <div className="text-center mt-10">Loading quizzes...</div>;

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">My Courses</h2>

        <div className="space-y-10">
          {/* Example group for one stream */}
          <div className="bg-blue-600 text-white rounded-t-lg px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">GATE Computer Science 2025</h3>
              <p className="text-sm text-blue-100">Complete preparation for GATE CS with comprehensive coverage</p>
            </div>
            <div className="flex gap-4 items-center text-sm">
              <div className="flex gap-1 items-center"><Users className="w-4 h-4" /> 2450 enrolled</div>
              <div className="flex gap-1 items-center"><BarChart className="w-4 h-4" /> 78% completion</div>
            </div>
          </div>

          <div className="bg-white shadow rounded-b-lg divide-y">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-1">{quiz.title}</h4>
                  <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                    <span>Duration: 120 minutes</span>
                    <span>2 Sections</span>
                    <span>50 Questions</span>
                    <span className="px-2 py-0.5 text-white text-xs rounded bg-red-500">Hard</span>
                    <span className="text-gray-500">1870 attempts • Avg. Score: 68.1%</span>
                  </div>
                </div>
                <div>
                  {attemptedMap[quiz._id] ? (
                    <button
                      className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded cursor-not-allowed"
                      disabled
                    >
                      Attempted
                    </button>
                  ) : (
                    <button
                      onClick={() => openTermsTab(quiz._id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                    >
                      Start Test
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}