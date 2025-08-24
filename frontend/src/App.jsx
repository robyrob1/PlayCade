import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './components/Landing/LandingPage'
import LoginPage from './components/Auth/LoginPage'
import SignupPage from './components/Auth/SignupPage'
import GamePage from './components/Game/GamePage'
import UserPage from './components/User/UserPage'
import CreationsPage from './components/Creations/CreationsPage'
import UploadGame from './components/Creations/UploadGame'
import EditGame from './components/Creations/EditGame'
import ProtectedRoute from './components/ProtectedRoute'
import { useDispatch } from 'react-redux'
import { restoreUser } from './store/sessionSlice'

export default function App(){
  const dispatch = useDispatch()
  useEffect(() => { dispatch(restoreUser()) }, [dispatch])

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tag/:tagName" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/games/:gameId" element={<GamePage />} />
        <Route path="/users/:userId" element={<UserPage />} />
        <Route path="/creations" element={<ProtectedRoute><CreationsPage /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadGame /></ProtectedRoute>} />
        <Route path="/edit/:gameId" element={<ProtectedRoute><EditGame /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
