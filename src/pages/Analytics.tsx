import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Clock, Target, Zap, Flame } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const weeklyData = [
  { day: 'Mon', focus: 120, score: 85 },
  { day: 'Tue', focus: 180, score: 92 },
  { day: 'Wed', focus: 90, score: 78 },
  { day: 'Thu', focus: 240, score: 95 },
  { day: 'Fri', focus: 150, score: 88 },
  { day: 'Sat', focus: 200, score: 90 },
  { day: 'Sun', focus: 160, score: 87 },
]

const hourlyData = [
  { hour: '6AM', productivity: 60 }, { hour: '8AM', productivity: 90 },
  { hour: '10AM', productivity: 100 }, { hour: '12PM', productivity: 70 },
  { hour: '2PM', productivity: 85 }, { hour: '4PM', productivity: 80 },
  { hour: '6PM', productivity: 70 }, { hour: '8PM', productivity: 55 },
]

export default function Analytics() {
  const { user } = useStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-text-dim">Track your productivity and study patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Focus Time', value: '47h 32m', change: '+12%', icon: Clock, color: 'text-primary-light' },
          { label: 'Tasks Completed', value: '156', change: '+8%', icon: Target, color: 'text-secondary' },
          { label: 'Avg Focus Score', value: '87.5', change: '+3.2%', icon: Zap, color: 'text-accent' },
          { label: 'Current Streak', value: `${user?.streak || 0} days`, change: '🔥', icon: Flame, color: 'text-orange-400' },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 card-hover">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-text-dim mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Weekly Focus Trend</h2>
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
        <h2 className="text-lg font-semibold text-white mb-4">Peak Productivity Hours</h2>
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