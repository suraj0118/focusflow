import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function AuthLanding() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-[color:var(--text)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[color:var(--text)]">FocusFlow</h1>
              <p className="text-text-dim text-sm">AI Productivity for students</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-[color:var(--text)] mb-4">Master your study sessions</h2>
          <p className="text-text-dim mb-8">Focus timers, tasks, flashcards and AI tools — all in one place designed for deep focus.</p>

          <div className="flex gap-4">
            <Link to="/signup" className="btn-primary px-6 py-3 rounded-xl">Get Started</Link>
            <Link to="/login" className="px-6 py-3 rounded-xl bg-surface border border-border text-text">Already have an account? Sign In</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden md:flex items-center justify-center">
          <div className="w-full h-96 rounded-2xl bg-gradient-to-br from-primary/20 via-surface to-surface border border-primary/20 p-6">
            <div className="h-full flex flex-col items-center justify-center">
              <h3 className="text-2xl font-semibold text-[color:var(--text)] mb-2">A calmer, deeper focus</h3>
              <p className="text-text-dim text-center">Start timed sessions and keep your study streaks. AI helps break down tasks into steps.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
