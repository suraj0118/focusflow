import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Zap, Clock, CheckCircle2, Target, Flame, BookOpen, Users, TrendingUp } from 'lucide-react'
import { formatDuration, getGreeting } from '../lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const weeklyData = [
  { day: 'Mon', minutes: 120, tasks: 4 },
  { day: 'Tue', minutes: 180, tasks: 6 },
  { day: 'Wed', minutes: 90, tasks: 3 },
  { day: 'Thu', minutes: 240, tasks: 8 },
  { day: 'Fri', minutes: 150, tasks: 5 },
  { day: 'Sat', minutes: 200, tasks: 7 },
  { day: 'Sun', minutes: 160, tasks: 5 },
]

export default function Dashboard() {
  const { user, tasks, sessions, studyGroups, flashcards, toggleFocusMode, setFocusSubject } = useStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pendingTasks = tasks.filter((t) => t.status !== 'completed')
  const completedTasks = tasks.filter((t) => t.status === 'completed')
  const todaySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.startedAt).toDateString()
    return sessionDate === new Date().toDateString() && s.type !== 'short-break' && s.type !== 'long-break'
  })

  const totalFocusMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0)

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-surface to-surface border border-primary/20 p-8">
        <div className="relative z-10">
          <p className="text-text-dim text-sm mb-1">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1 className="text-3xl font-bold text-white mb-2">{getGreeting()}, {user?.name.split(' ')[0]}! 🔥</h1>
          <p className="text-text-muted">You have <span className="text-primary-light font-semibold">{pendingTasks.length}</span> tasks pending</p>
          
          <div className="flex gap-3 mt-6">
            {['Database', 'React', 'Algorithms', 'Programming'].map((subject) => (
              <button key={subject} onClick={() => { setFocusSubject(subject); toggleFocusMode(); }} className="px-4 py-2 rounded-xl bg-surface/80 border border-border hover:border-primary/30 text-sm font-medium text-text-muted hover:text-white flex items-center gap-2">
                <Zap className="w-4 h-4" /> {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Focus", value: formatDuration(totalFocusMinutes), icon: Clock, color: 'text-primary-light', bg: 'bg-primary/10' },
          { label: 'Tasks Completed', value: `${completedTasks.length}/${tasks.length}`, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'Focus Score', value: '87', icon: Target, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'Current Streak', value: `${user?.streak || 0} days`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 card-hover">
            <div className={`p-2.5 rounded-xl ${stat.bg} w-fit mb-3`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-text-dim mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Weekly Focus Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366F1" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', color: '#F8FAFC' }} />
              <Area type="monotone" dataKey="minutes" stroke="#6366F1" strokeWidth={2} fill="url(#colorMin)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Tasks</h2>
          <div className="space-y-3">
            {pendingTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-light/50">
                <div className="w-1 h-10 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-white">{task.title}</p>
                  <p className="text-xs text-text-dim">{task.subject} • {formatDuration(task.estimatedMinutes || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}