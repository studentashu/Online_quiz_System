import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [quizError, setQuizError] = useState(null);

  const [quizAnswers, setQuizAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [answersError, setAnswersError] = useState(null);

  const [uploadStatus, setUploadStatus] = useState("");

  // Fetch quizzes on mount
  useEffect(() => {
    api.get("/api/quizzes")
      .then((response) => {
        setQuizzes(response.data);
        setLoadingQuizzes(false);
      })
      .catch((err) => {
        setQuizError(err.response?.data?.message || err.message);
        setLoadingQuizzes(false);
      });
  }, []);

  // Excel upload handler
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload-users-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus(`✅ Uploaded ${res.data.users.length} users successfully.`);
    } catch (err) {
      setUploadStatus("❌ Upload failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Fetch all quiz answers when button clicked
  const fetchQuizAnswers = async () => {
    setLoadingAnswers(true);
    setAnswersError(null);
    try {
      const res = await api.get("/api/admin/quizanswers");
      setQuizAnswers(res.data);
    } catch (err) {
      setAnswersError(err.response?.data?.message || "Failed to fetch quiz answers");
    } finally {
      setLoadingAnswers(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-8 text-center text-lg">
          Welcome, {user?.name} ({user?.role})
        </p>

        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <Link
            to="/admin/profile"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition duration-200 shadow-md text-center"
          >
            Go to Profile
          </Link>
          <Link
            to="/admin/userlist"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition duration-200 shadow-md text-center"
          >
            View User List
          </Link>
          <Link
            to="/admin/createquiz"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition duration-200 shadow-md text-center"
          >
            Create Quiz
          </Link>

          
          
        </div>

        {/* New buttons for quizzes & quiz answers */}
        <div className="flex flex-col items-center gap-4 mt-10">
          {/* View Quizzes - navigates to quiz list */}
         <Link to="/admin/quizzes" className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition duration-200 shadow-md text-center">
            View Quizzes
          </Link>

          {/* View All Quiz Answers - fetch & show here */}
          <button
            onClick={fetchQuizAnswers}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition w-48"
          >
            View All Quiz Answers
          </button>
        </div>

        {/* Show quiz answers table */}
        <div className="mt-8">
          {loadingAnswers && <p className="text-center text-gray-500">Loading quiz answers...</p>}
          {answersError && <p className="text-center text-red-600">{answersError}</p>}

          {quizAnswers.length > 0 && (
            <table className="min-w-full border border-gray-300 rounded-lg mt-4">
              <thead>
                <tr className="bg-purple-100 text-purple-800">
                  <th className="border px-4 py-2">User ID</th>
                  <th className="border px-4 py-2">Quiz ID</th>
                  <th className="border px-4 py-2">Answers</th>
                  <th className="border px-4 py-2">Score</th>
                  <th className="border px-4 py-2">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {quizAnswers.map((answer) => (
                  <tr key={answer._id} className="hover:bg-purple-50">
                   <td className="border px-4 py-2">{answer.email || answer.user?._id}</td>

                    <td className="border px-4 py-2">{answer.quiz}</td>
                    <td className="border px-4 py-2">{JSON.stringify(answer.answers)}</td>
                    <td className="border px-4 py-2">{answer.score}</td>
                    <td className="border px-4 py-2">{new Date(answer.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="mt-8 px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;