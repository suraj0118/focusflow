import { User, Task, FocusSession, StudyGroup, Flashcard, Notification } from '../types'
import { generateId } from '../lib/utils'

export const demoUser: User = {
  id: 'user-1',
  email: 'student@university.edu',
  name: 'Alex Johnson',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  focusScore: 2847,
  streak: 12,
  createdAt: '2026-01-15T00:00:00Z',
}

export const demoTasks: Task[] = [
  {
    id: generateId(),
    title: 'Complete Database Normalization Assignment',
    description: 'Normalize the given schema to 3NF and document the process',
    priority: 'urgent-important',
    deadline: '2026-05-20T23:59:00Z',
    status: 'in-progress',
    subject: 'Database',
    estimatedMinutes: 120,
    userId: 'user-1',
    createdAt: '2026-05-18T10:00:00Z',
  },
  {
    id: generateId(),
    title: 'React Hooks Deep Dive - useEffect & useMemo',
    description: 'Study advanced patterns and create practice examples',
    priority: 'not-urgent-important',
    deadline: '2026-05-22T18:00:00Z',
    status: 'pending',
    subject: 'React',
    estimatedMinutes: 90,
    userId: 'user-1',
    createdAt: '2026-05-18T09:00:00Z',
  },
  {
    id: generateId(),
    title: 'Prepare for Algorithms Midterm',
    description: 'Review sorting algorithms, graph traversal, and dynamic programming',
    priority: 'urgent-important',
    deadline: '2026-05-25T09:00:00Z',
    status: 'pending',
    subject: 'Algorithms',
    estimatedMinutes: 240,
    userId: 'user-1',
    createdAt: '2026-05-17T14:00:00Z',
  },
  {
    id: generateId(),
    title: 'Debug Authentication Flow',
    description: 'Fix JWT token refresh issue in the app',
    priority: 'urgent-important',
    deadline: '2026-05-19T12:00:00Z',
    status: 'completed',
    subject: 'Programming',
    estimatedMinutes: 45,
    userId: 'user-1',
    createdAt: '2026-05-17T09:00:00Z',
    completedAt: '2026-05-18T11:30:00Z',
  },
]

export const demoSessions: FocusSession[] = [
  { id: generateId(), duration: 25, type: 'pomodoro', score: 95, subject: 'Database', userId: 'user-1', startedAt: '2026-05-18T08:00:00Z', endedAt: '2026-05-18T08:25:00Z' },
  { id: generateId(), duration: 25, type: 'pomodoro', score: 88, subject: 'Database', userId: 'user-1', startedAt: '2026-05-18T08:30:00Z', endedAt: '2026-05-18T08:55:00Z' },
  { id: generateId(), duration: 5, type: 'short-break', score: 100, userId: 'user-1', startedAt: '2026-05-18T08:55:00Z', endedAt: '2026-05-18T09:00:00Z' },
  { id: generateId(), duration: 50, type: 'deep-work', score: 92, subject: 'React', userId: 'user-1', startedAt: '2026-05-18T09:00:00Z', endedAt: '2026-05-18T09:50:00Z' },
]

export const demoStudyGroups: StudyGroup[] = [
  {
    id: generateId(),
    name: 'CS Final Year Squad',
    description: 'Preparing for final semester exams together',
    inviteCode: 'CS2026XYZ',
    members: [
      { id: 'm1', name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: 'admin', focusScore: 3200, isOnline: true },
      { id: 'm2', name: 'Mike Ross', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', role: 'member', focusScore: 1890, isOnline: true },
      { id: 'm3', name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', role: 'member', focusScore: 2450, isOnline: false },
      { id: 'm4', name: 'James Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', role: 'member', focusScore: 1560, isOnline: true },
    ],
    createdBy: 'm1',
    createdAt: '2026-04-01T00:00:00Z',
  },
]

export const demoFlashcards: Flashcard[] = [
  {
    id: generateId(),
    question: 'What is Database Normalization?',
    answer: 'The process of organizing data in a database to reduce redundancy and improve data integrity.',
    source: 'ai-generated',
    subject: 'Database',
    difficulty: 'medium',
    userId: 'user-1',
    createdAt: '2026-05-15T00:00:00Z',
    reviewCount: 3,
    lastReviewed: '2026-05-18T00:00:00Z',
  },
  {
    id: generateId(),
    question: 'Explain the difference between useEffect and useLayoutEffect',
    answer: 'useEffect runs asynchronously after paint, useLayoutEffect runs synchronously before paint.',
    source: 'ai-generated',
    subject: 'React',
    difficulty: 'hard',
    userId: 'user-1',
    createdAt: '2026-05-14T00:00:00Z',
    reviewCount: 2,
    lastReviewed: '2026-05-17T00:00:00Z',
  },
  {
    id: generateId(),
    question: 'What is the time complexity of QuickSort in average case?',
    answer: 'O(n log n). Worst case is O(n²).',
    source: 'ai-generated',
    subject: 'Algorithms',
    difficulty: 'easy',
    userId: 'user-1',
    createdAt: '2026-05-13T00:00:00Z',
    reviewCount: 5,
    lastReviewed: '2026-05-18T00:00:00Z',
  },
]

export const demoNotifications: Notification[] = [
  {
    id: generateId(),
    type: 'achievement',
    title: '7-Day Streak!',
    message: 'You have maintained focus for 7 consecutive days. Incredible discipline!',
    read: false,
    createdAt: '2026-05-18T09:00:00Z',
  },
  {
    id: generateId(),
    type: 'success',
    title: 'Task Completed',
    message: 'You completed "Debug Authentication Flow" ahead of schedule!',
    read: false,
    createdAt: '2026-05-18T11:35:00Z',
  },
]