import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  Sparkles,
  Users,
  BarChart3,
  BookOpen,
  Zap,
  Flame,
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/focus', icon: Timer, label: 'Focus Room' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/ai-assistant', icon: Sparkles, label: 'AI Assistant' },
  { path: '/study-groups', icon: Users, label: 'Study Groups' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/flashcards', icon: BookOpen, label: 'Flashcards' },
]

export default function Sidebar() {
  const { sidebarOpen, user } = useStore()

  return (
    <AnimatePresence mode="wait">
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full bg-surface border-r border-border flex flex-col overflow-hidden"
        >
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">FocusFlow</h1>
              <p className="text-xs text-text-dim">AI Productivity</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary/15 text-primary-light border border-primary/20' : 'text-text-muted hover:bg-surface-light hover:text-text'}`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {user && (
            <div className="p-4 m-4 rounded-xl bg-surface-light border border-border">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-primary/30" />
                <div>
                  <p className="font-semibold text-sm text-white">{user.name}</p>
                  <div className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-xs text-orange-400">{user.streak} day streak</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}