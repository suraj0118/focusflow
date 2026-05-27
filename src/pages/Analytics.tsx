import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Clock, Target, Zap, Flame } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useEffect, useState } from 'react'

export default function Analytics() {
  const { user } = useStore()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ totalFocusMinutes: 0, tasksCompleted: 0, avgFocusScore: 0, streak: 0, weekly: [] })

  useEffect(() => {
    if (!user?.email) return
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/analytics?email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData({ totalFocusMinutes: 0, tasksCompleted: 0, avgFocusScore: 0, streak: 0, weekly: [] }))
      .finally(() => setLoading(false))
  }, [user?.email])

  const stats = [
    { label: 'Total Focus Time', value: `${Math.floor(data.totalFocusMinutes / 60)}h ${data.totalFocusMinutes % 60}m`, icon: Clock, color: 'text-primary-light' },
    { label: 'Tasks Completed', value: `${data.tasksCompleted}`, icon: Target, color: 'text-secondary' },
    { label: 'Avg Focus Score', value: `${data.avgFocusScore}`, icon: Zap, color: 'text-accent' },
    { label: 'Current Streak', value: `${data.streak} days`, icon: Flame, color: 'text-orange-400' },
  ]

  const weeklyData = data.weekly || []
  const hourlyData = [] // keep empty for now; could be added from sessions

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text)]">Analytics</h1>
          <p className="text-text-dim">Track your productivity and study patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 card-hover">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <p className="text-2xl font-bold text-[color:var(--text)]">{loading ? '—' : stat.value}</p>
            <p className="text-sm text-text-dim mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[color:var(--text)] mb-4">Weekly Focus Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weeklyData}>
            <defs><linearGradient id="c1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366F1" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', color: '#F8FAFC' }} />
            <Area type="monotone" dataKey="focus" stroke="#6366F1" strokeWidth={2} fill="url(#c1)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[color:var(--text)] mb-4">Peak Productivity Hours</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', color: '#F8FAFC' }} />
            <Bar dataKey="productivity" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}