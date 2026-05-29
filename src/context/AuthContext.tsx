import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User as AppUser } from '../types'
import { useStore } from '../store/useStore'
import { isFirebaseConfigured, firebaseSignIn, firebaseSignUp, firebaseSignOut, onFirebaseAuthStateChanged, firebaseUpdateProfile } from '../lib/firebase'

interface AuthContextValue {
  user: AppUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string; bio?: string; username?: string; studyGoals?: string; dailyFocusTarget?: number }) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const { login, logout, addNotification } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      return
    }

    const unsubscribe = onFirebaseAuthStateChanged(async (fbUser) => {
      setLoading(true)
      if (fbUser) {
        // ensure Firebase has issued an ID token before proceeding
        try {
          await fbUser.getIdToken()
        } catch (e) {
          // ignore token errors and continue — we'll still set user
        }
        // prefer persisted store values if user previously edited profile locally
        const persisted = (useStore as any).getState().user as AppUser | null
        const u: AppUser = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: persisted?.name || fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'User'),
          avatar: null,
          focusScore: persisted?.focusScore || 0,
          streak: persisted?.streak || 0,
          createdAt: persisted?.createdAt || new Date().toISOString(),
        }

        // attempt to fetch server-stored profile by email (public endpoint)
        if (fbUser.email) {
          try {
            const r = await fetch(`http://localhost:4000/user/public?email=${encodeURIComponent(fbUser.email)}`)
            if (r.ok) {
              const srv = await r.json()
              const merged = { ...u, name: srv.name || u.name, avatar: srv.avatar || u.avatar }
              setUser(merged)
              login(merged)
              setLoading(false)
              return
            }
          } catch (e) {
            // ignore fetch errors
          }
        }
        setUser(u)
        login(u)
        setLoading(false)
      } else {
        setUser(null)
        logout()
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [login, logout])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const cred: any = await firebaseSignIn(email, password)

      // ensure Firebase ID token is available before contacting backend
      if (isFirebaseConfigured && cred?.user) {
        try {
          const idToken = await cred.user.getIdToken()
          // send ID token and credentials to backend to obtain backend JWT
          try {
            const res = await fetch('http://localhost:4000/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` }, body: JSON.stringify({ email, password }) })
            if (res.ok) {
              const data = await res.json()
              if (data?.token) localStorage.setItem('ff_jwt', data.token)
            }
          } catch (e) {
            // ignore backend auth errors — app can still function with Firebase
          }
        } catch (e) {
          // ignore token errors
        }
      }

      addNotification({ id: Date.now().toString(), type: 'success', title: 'Signed in', message: 'Welcome back!', read: false, createdAt: new Date().toISOString() })
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      const cred: any = await firebaseSignUp(email, password)

      if (isFirebaseConfigured && cred?.user) {
        try {
          const idToken = await cred.user.getIdToken()
          try {
            const res = await fetch('http://localhost:4000/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` }, body: JSON.stringify({ email, password }) })
            if (res.ok) {
              const data = await res.json()
              if (data?.token) localStorage.setItem('ff_jwt', data.token)
            }
          } catch (e) {
            // ignore backend register errors
          }
        } catch (e) {
          // ignore token errors
        }
      }

      addNotification({ id: Date.now().toString(), type: 'success', title: 'Account created', message: 'Welcome to FocusFlow!', read: false, createdAt: new Date().toISOString() })
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      if (isFirebaseConfigured) await firebaseSignOut()
      setUser(null)
      logout()
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: { name?: string; avatar?: string; bio?: string }) => {
    setLoading(true)
    try {
      // update Firebase profile when available
      if (isFirebaseConfigured) {
        const p: any = {}
        if (data.name) p.displayName = data.name
        if (data.avatar) p.photoURL = data.avatar
        if (Object.keys(p).length) await firebaseUpdateProfile(p)
      }

      // update local store (prefer existing persisted user)
      const persisted = (useStore as any).getState().user as AppUser | null
      const merged: AppUser = {
        id: persisted?.id || user?.id || 'unknown',
        email: persisted?.email || user?.email || '',
        name: data.name ?? persisted?.name ?? user?.name ?? '',
        avatar: null,
        username: (data as any).username ?? persisted?.username ?? (user as any)?.username ?? '',
        bio: data.bio ?? persisted?.bio ?? (user as any)?.bio ?? '',
        studyGoals: (data as any).studyGoals ?? persisted?.studyGoals ?? (user as any)?.studyGoals ?? '',
        dailyFocusTarget: (data as any).dailyFocusTarget ?? persisted?.dailyFocusTarget ?? (user as any)?.dailyFocusTarget ?? 0,
        focusScore: persisted?.focusScore ?? user?.focusScore ?? 0,
        streak: persisted?.streak ?? user?.streak ?? 0,
        createdAt: persisted?.createdAt ?? user?.createdAt ?? new Date().toISOString(),
      }
      login(merged)
      // attempt to persist to server
      try {
        // attempt to persist to server; include email when available
        const email = user?.email || (useStore as any).getState().user?.email
        if (email) {
          await fetch('http://localhost:4000/user/public', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name: data.name, username: (data as any).username, bio: data.bio, studyGoals: (data as any).studyGoals, dailyFocusTarget: (data as any).dailyFocusTarget }) })
          // fetch latest saved profile
          const res = await fetch(`http://localhost:4000/user/public?email=${encodeURIComponent(email)}`)
          if (res.ok) {
            const srv = await res.json()
            const final = { ...merged, name: srv.name || merged.name, username: srv.username || merged.username, bio: srv.bio || merged.bio, studyGoals: srv.studyGoals || merged.studyGoals, dailyFocusTarget: srv.dailyFocusTarget ?? merged.dailyFocusTarget }
            login(final)
          }
        }
      } catch (e) {
        // ignore
      }
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
