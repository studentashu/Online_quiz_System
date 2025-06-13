import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { User, FileText, FlaskConical } from 'lucide-react'; // BookOpen removed as it’s unused

const StudentDashboard = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-100 via-pink-100 to-white">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl border-r border-gray-200 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-purple-700 mb-8 tracking-wide">
          🎓 Student Panel
        </h2>
        
        <nav className="flex flex-col gap-5 text-base font-medium text-purple-800">
          <Link to="/student/profile" className="flex items-center gap-3 hover:text-purple-600 transition">
            <User size={20} /> My Profile
          </Link>
          <Link to="/student/quizzes" className="flex items-center gap-3 hover:text-purple-600 transition">
            <FlaskConical size={20} /> My Courses
          </Link>
          <Link to="/student/results" className="flex items-center gap-3 hover:text-purple-600 transition">
            <FileText size={20} /> Results
          </Link>
        </nav>

        <div className="mt-auto pt-10 text-sm text-gray-400 font-light">
          &copy; {new Date().getFullYear()} Vegaahi
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-purple-700 mb-4">
            Welcome to nDMatrix
          </h1>
          <p className="text-lg text-purple-600 leading-relaxed max-w-3xl">
            We're thrilled to have you here! 💫 Prepare yourself with curated mock tests, essential resources, and personalized progress tracking to elevate your learning journey.
          </p>
        </div>

        {/* Renders nested routes like profile, courses, results, etc. */}
        <div className="bg-white rounded-xl shadow p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;