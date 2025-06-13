import React, { useEffect, useState } from "react";
import api from "./api";
import { Link } from "react-router-dom";
 
const AdminQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    fetchQuizzes();
  }, []);
 
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/quizzes");
      setQuizzes(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };
 
  const deleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await api.delete(`/api/quizzes/${id}`);
      fetchQuizzes();
    } catch (err) {
      alert("Failed to delete quiz: " + (err.response?.data?.message || err.message));
    }
  };
 
  return (
    <div className="max-w-6xl mx-auto p-10 bg-gradient-to-br from-indigo-50 via-white to-indigo-50 rounded-3xl shadow-xl">
      <h1 className="text-5xl font-extrabold mb-12 text-center text-indigo-900 tracking-wide drop-shadow-md">
        Manage Quizzes
      </h1>
 
      {loading && (
        <p className="text-center text-indigo-400 text-xl animate-pulse">
          Loading quizzes...
        </p>
      )}
      {error && (
        <p className="text-center text-red-600 font-semibold mb-6">{error}</p>
      )}
 
      {!loading && quizzes.length === 0 && (
        <p className="text-center text-gray-600 text-xl italic">
          No quizzes found.
        </p>
      )}
 
      {!loading && quizzes.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-indigo-200 shadow-lg bg-white">
          <table className="min-w-full divide-y divide-indigo-200">
            <thead className="bg-indigo-100">
              <tr>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-lg font-semibold text-indigo-700 tracking-wide"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-8 py-4 text-center text-lg font-semibold text-indigo-700 tracking-wide"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-200 bg-white">
              {quizzes.map((quiz) => (
                <tr
                  key={quiz._id}
                  className="hover:bg-indigo-50 transition-colors duration-300"
                >
                  <td className="px-8 py-5 whitespace-nowrap text-indigo-900 font-semibold text-xl">
                    {quiz.title}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center space-x-6">
                    <Link
                      to={`/admin/quizzes/${quiz._id}/edit`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-5 py-2 rounded-full shadow-lg hover:from-indigo-600 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
                      title="Edit Questions"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 17h2m-1-6v6m5-3h2m-6 6v2a2 2 0 002-2v-2m-6 0v2a2 2 0 002 2v-2m-6-6h2m-2-4h2m-2-4h2"
                        />
                      </svg>
                      Edit Questions
                    </Link>
 
                    <button
                      onClick={() => deleteQuiz(quiz._id)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2 rounded-full shadow-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 transition"
                      title="Delete Quiz"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
 
export default AdminQuizList;
 
 