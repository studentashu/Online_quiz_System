import { Routes, Route } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import Profile from './profile'
import UserList from './UserList'
import QuizForm from './QuizForm'
import QuizSubmissions from './QuizSubmissions'
import AdminUploadExcel from './AdminUploadExcel'
import AllQuizAnswers from './AllQuizAnswers';
import AdminQuizEdit from './AdminQuizEdit'
import AdminQuizList from './AdminQuizList'

const AdminRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/createquiz" element={<QuizForm />} />
        <Route path="/admin/quiz-answers" element={<AllQuizAnswers />} />
        {/* Add more routes as needed */}
        <Route path="quizzes/:id" element={<QuizSubmissions />} />
        <Route path="/quizzes" element={<AdminQuizList />} />
      <Route path="/quizzes/:id/edit" element={<AdminQuizEdit />} />
        <Route path="/upload-users" element={<AdminUploadExcel/>} />
      </Routes>
    </>
  )
}

export default AdminRoutes