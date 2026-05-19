import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Task, FocusSession, StudyGroup, Flashcard, StudyPlan, Notification } from '../types'

interface AppState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  completeTask: (id: string) => void
  sessions: FocusSession[]
  addSession: (session: FocusSession) => void
  activeSession: FocusSession | null
  setActiveSession: (session: FocusSession | null) => void
  studyGroups: StudyGroup[]
  addStudyGroup: (group: StudyGroup) => void
  flashcards: Flashcard[]
  addFlashcard: (card: Flashcard) => void
  reviewFlashcard: (id: string) => void
  studyPlans: StudyPlan[]
  addStudyPlan: (plan: StudyPlan) => void
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  isFocusMode: boolean
  toggleFocusMode: () => void
  focusSubject: string
  setFocusSubject: (subject: string) => void
  isAILoading: boolean
  setIsAILoading: (loading: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) => set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      completeTask: (id) => set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() } : t)) })),
      sessions: [],
      addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
      activeSession: null,
      setActiveSession: (session) => set({ activeSession: session }),
      studyGroups: [],
      addStudyGroup: (group) => set((state) => ({ studyGroups: [...state.studyGroups, group] })),
      flashcards: [],
      addFlashcard: (card) => set((state) => ({ flashcards: [...state.flashcards, card] })),
      reviewFlashcard: (id) => set((state) => ({ flashcards: state.flashcards.map((c) => (c.id === id ? { ...c, reviewCount: c.reviewCount + 1, lastReviewed: new Date().toISOString() } : c)) })),
      studyPlans: [],
      addStudyPlan: (plan) => set((state) => ({ studyPlans: [...state.studyPlans, plan] })),
      notifications: [],
      addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
      markNotificationRead: (id) => set((state) => ({ notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      clearNotifications: () => set({ notifications: [] }),
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      isFocusMode: false,
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
      focusSubject: '',
      setFocusSubject: (subject) => set({ focusSubject: subject }),
      isAILoading: false,
      setIsAILoading: (loading) => set({ isAILoading: loading }),
    }),
    {
      name: 'focusflow-storage',
      partialize: (state) => ({
        user: state.user,
        tasks: state.tasks,
        sessions: state.sessions,
        flashcards: state.flashcards,
        studyPlans: state.studyPlans,
        studyGroups: state.studyGroups,
        notifications: state.notifications,
      }),
    }
  )
)