import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import AuthCard from '../../components/auth/AuthCard'
import { useAuth } from '../../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const validate = () => {
    if (!email || !password || !confirm) {
      setError('Please fill all fields')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    setIsLoading(true)
    try {
      await signUp(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <AuthCard>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--text)] mb-2">Create your account</h2>
          <p className="text-text-dim">Start using FocusFlow to build focus sessions and track progress</p>
        </div>

        <form onSubmit={handle} className="space-y-4">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div>
            <label className="block text-sm text-text-dim mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="" className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder-text-dim focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-dim mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" className="w-full pl-11 pr-12 py-3 rounded-xl bg-surface border border-border text-text placeholder-text-dim focus:outline-none focus:border-primary" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-dim mb-2">Confirm password</label>
            <input type={showPassword ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="" className="w-full pl-4 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder-text-dim focus:outline-none focus:border-primary" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center gap-2 py-3">
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-text-dim">
          Already have an account? <Link to="/login" className="text-primary-light font-semibold">Sign in</Link>
        </div>
      </AuthCard>
    </div>
  )
}
