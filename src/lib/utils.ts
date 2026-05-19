import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent-important': return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'urgent-not-important': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'not-urgent-important': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'not-urgent-not-important': return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    default: return 'bg-slate-500/20 text-slate-400'
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'urgent-important': return 'Do First'
    case 'urgent-not-important': return 'Delegate'
    case 'not-urgent-important': return 'Schedule'
    case 'not-urgent-not-important': return 'Eliminate'
    default: return priority
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    'Database': '#6366F1', 'React': '#61DAFB', 'Algorithms': '#F59E0B',
    'Programming': '#10B981', 'Mathematics': '#EC4899', 'Computer Science': '#8B5CF6',
    'Physics': '#06B6D4', 'Chemistry': '#F97316', 'English': '#84CC16',
    'JavaScript': '#F7DF1E', 'Python': '#3776AB',
  }
  return colors[subject] || '#6366F1'
}