import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 text-center">
      {/* Main Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
        Online Test Registration & <span className="text-blue-600">Examination</span> Portal
      </h1>

      {/* Subheading */}
      <p className="text-gray-600 mb-6 max-w-xl">
        Prepare for GATE 2025 with our comprehensive online examination platform. Take mock tests, analyze performance, and achieve your goals.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mb-10">
        <Link
          to="/login"
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded hover:opacity-90 text-sm"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="border border-blue-500 text-blue-500 px-5 py-2 rounded hover:bg-blue-50 text-sm"
        >
          Sign In
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded p-6 w-72">
          <div className="text-blue-500 text-3xl mb-2">🛡</div>
          <h3 className="text-lg font-semibold mb-1">Secure Registration</h3>
          <p className="text-sm text-gray-600">
            Safe and secure registration process with automatic password generation and email verification.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded p-6 w-72">
          <div className="text-purple-600 text-3xl mb-2">🎓</div>
          <h3 className="text-lg font-semibold mb-1">GATE Interface</h3>
          <p className="text-sm text-gray-600">
            Experience the authentic GATE exam interface with MCQ and NAT question types.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded p-6 w-72">
          <div className="text-yellow-500 text-3xl mb-2">🏆</div>
          <h3 className="text-lg font-semibold mb-1">Detailed Analytics</h3>
          <p className="text-sm text-gray-600">
            Comprehensive performance analysis with detailed solutions and progress tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;