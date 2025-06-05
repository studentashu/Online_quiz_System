import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import api from "./api";
 
const QuizSubmissions = () => {
  const { id } = useParams(); // quiz id from route param
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // adjust if you store token differently
        const response = await api.get(`/api/quiz/${id}/answers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnswers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch submissions");
        setLoading(false);
      }
    };
 
    fetchAnswers();
  }, [id]);
 
  if (loading) return <p className="text-center mt-10">Loading submissions...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
 
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded mt-8">
      <h2 className="text-2xl font-semibold mb-4">Quiz Submissions</h2>
 
      {answers.length === 0 ? (
        <p>No submissions found for this quiz.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">User Name</th>
              <th className="border border-gray-300 px-4 py-2">User Email</th>
              <th className="border border-gray-300 px-4 py-2">Answers</th>
              <th className="border border-gray-300 px-4 py-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((answer) => (
              <tr key={answer._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{answer.user?.name || "Unknown"}</td>
                <td className="border border-gray-300 px-4 py-2">{answer.user?.email || "Unknown"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul className="list-disc list-inside">
                    {answer.responses?.map((resp, idx) => (
                      <li key={idx}>
                        Q: {resp.question} <br />
                        A: {resp.selectedOption}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(answer.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
 
export default QuizSubmissions;
 
 