import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) return null
  if (!user) return <Navigate to="/" state={{ from: loc }} replace />
  return children
}
