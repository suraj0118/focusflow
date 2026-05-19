import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './store/useStore'
import { demoUser, demoTasks, demoSessions, demoStudyGroups, demoFlashcards, demoNotifications } from './data/demoData'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import FocusRoom from './pages/FocusRoom'
import Tasks from './pages/Tasks'
import AIAssistant from './pages/AIAssistant'
import StudyGroups from './pages/StudyGroups'
import Analytics from './pages/Analytics'
import Flashcards from './pages/Flashcards'
import Login from './pages/Login'

function App() {
  const { isAuthenticated, login, addTask, addSession, addStudyGroup, addFlashcard, addNotification } = useStore()

  useEffect(() => {
    const hasLoaded = localStorage.getItem('focusflow-demo-loaded')
    if (!hasLoaded) {
      login(demoUser)
      demoTasks.forEach(addTask)
      demoSessions.forEach(addSession)
      demoStudyGroups.forEach(addStudyGroup)
      demoFlashcards.forEach(addFlashcard)
      demoNotifications.forEach(addNotification)
      localStorage.setItem('focusflow-demo-loaded', 'true')
    }
  }, [])

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="focus" element={<FocusRoom />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="study-groups" element={<StudyGroups />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="flashcards" element={<Flashcards />} />
      </Route>
    </Routes>
  )
}

export default App