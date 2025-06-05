
import { Routes, Route } from 'react-router-dom'
import StudentDashboard from './StudnetDashboard'
import Studentprofile from './StudentProfile'
import UserQuizList from './UserQuizList'
import QuizAttempt from './QuizAttempt'
import TermsPage from './TermsPage'




const studentdashboard = () => {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/profile" element={<Studentprofile />} />
        <Route path="/quizzes" element={<UserQuizList/>} />
       

        <Route path="/quiz/:id" element={<QuizAttempt />} />
        
    
        {/* Add more routes as needed */}
      </Routes>
    </>
  )
}

export default studentdashboard