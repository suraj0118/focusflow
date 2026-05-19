import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { demoUser } from '../data/demoData'
import { Zap, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

export default function Login() {
  const { login } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      login(demoUser)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="relative z-10 p-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">FocusFlow</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Master Your Studies with AI-Powered Focus</h2>
          <p className="text-text-muted text-lg">The ultimate productivity platform for students.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-text-dim">Sign in to continue your focus journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-text-dim mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@university.edu" className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder-text-dim focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-dim mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-12 py-3 rounded-xl bg-surface border border-border text-text placeholder-text-dim focus:outline-none focus:border-primary" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center gap-2 py-3">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}