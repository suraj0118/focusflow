export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  focusScore: number
  streak: number
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important'
  deadline?: string
  status: 'pending' | 'in-progress' | 'completed'
  aiBreakdown?: { step: string; estimatedMinutes: number }[]
  subject?: string
  estimatedMinutes?: number
  userId: string
  createdAt: string
  completedAt?: string
}

export interface FocusSession {
  id: string
  duration: number
  type: 'pomodoro' | 'deep-work' | 'short-break' | 'long-break'
  score: number
  subject?: string
  userId: string
  startedAt: string
  endedAt?: string
}

export interface StudyGroup {
  id: string
  name: string
  description?: string
  inviteCode: string
  members: GroupMember[]
  createdBy: string
  createdAt: string
}

export interface GroupMember {
  id: string
  name: string
  avatar?: string
  role: 'admin' | 'member'
  focusScore: number
  isOnline: boolean
}

export interface Flashcard {
  id: string
  question: string
  answer: string
  source: 'ai-generated' | 'manual'
  subject?: string
  difficulty: 'easy' | 'medium' | 'hard'
  userId: string
  createdAt: string
  lastReviewed?: string
  reviewCount: number
}

export interface StudyPlan {
  id: string
  title: string
  subjects: string[]
  totalDays: number
  hoursPerDay: number
  schedule: DaySchedule[]
  userId: string
  createdAt: string
}

export interface DaySchedule {
  day: number
  date: string
  sessions: StudySession[]
}

export interface StudySession {
  subject: string
  topic: string
  duration: number
  type: 'study' | 'review' | 'practice'
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'achievement'
  title: string
  message: string
  read: boolean
  createdAt: string
}