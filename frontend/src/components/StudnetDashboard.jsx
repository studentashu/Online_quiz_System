import React from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-16">
      <h1 className="text-4xl font-semibold mb-6 text-purple-600 relative">
        Welcome to the Student Dashboard
        <span className="absolute left-1/2 -bottom-2 w-20 h-1 bg-purple-300 rounded-full -translate-x-1/2"></span>
      </h1>

      <p className="max-w-xl text-center text-purple-700 mb-10 text-base leading-relaxed font-normal">
        Hello! We're excited to have you here at{' '}
        <span className="font-semibold underline decoration-pink-300 decoration-1">Vegaahi</span>. 
        Prepare yourself with our curated mock tests designed to boost your skills and confidence.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-pink-400">
        Vegaahi Mock Test
      </h2>
      <p className="max-w-xl text-center text-gray-600 mb-8 leading-relaxed text-base">
        Take the Vegaahi Mock Test to simulate real exam conditions and improve your performance.
        These tests are designed by experts to cover important topics and help you track your progress.
      </p>

      <div className="flex gap-4 justify-center mb-12">
        <Link
          to="/student/profile"
          className="bg-purple-300 text-purple-900 px-6 py-2 rounded-lg shadow-sm hover:bg-purple-400 transition"
        >
         Profile
        </Link>

        <Link
          to="/student/quizzes"
          className="bg-pink-300 text-pink-900 px-6 py-2 rounded-lg shadow-sm hover:bg-pink-400 transition"
        >
          Start Quiz
        </Link>
      </div>

      <footer className="text-purple-500 italic font-medium text-sm">
        &copy; {new Date().getFullYear()} Vegaahi — Empowering Your Learning Journey
      </footer>
    </div>
  );
};

export default StudentDashboard;
