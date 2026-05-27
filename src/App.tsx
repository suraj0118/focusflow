import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import FocusRoom from './pages/FocusRoom'
import Tasks from './pages/Tasks'
import StudyGroups from './pages/StudyGroups'
import Analytics from './pages/Analytics'
import Flashcards from './pages/Flashcards'
import Profile from './pages/profile/Profile'
import AuthLanding from './pages/auth/AuthLanding'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import { useAuth } from './context/AuthContext'
import RequireAuth from './components/RequireAuth'

export default function App() {
  const { loading } = useAuth()

  if (loading) return null

  return (
    <Routes>
      <Route path="/" element={<AuthLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="focus" element={<FocusRoom />} />
        <Route path="tasks" element={<Tasks />} />
        {/* AI Assistant removed */}
        <Route path="study-groups" element={<StudyGroups />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}