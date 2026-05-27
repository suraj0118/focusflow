import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Play, Pause, RotateCcw, Volume2, Flame, Trophy } from 'lucide-react'

const sessionTypes = {
  pomodoro: { duration: 25 * 60, label: 'Pomodoro' },
  'deep-work': { duration: 50 * 60, label: 'Deep Work' },
  'short-break': { duration: 5 * 60, label: 'Short Break' },
  'long-break': { duration: 15 * 60, label: 'Long Break' },
}

export default function FocusRoom() {
  const { user, addSession } = useStore()
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [currentType, setCurrentType] = useState<keyof typeof sessionTypes>('pomodoro')
  const [completedSessions, setCompletedSessions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setTimeLeft(sessionTypes[currentType].duration)
  }, [currentType])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((p) => p - 1), 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, timeLeft])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text)]">Focus Room</h1>
          <p className="text-text-dim">Enter your flow state and maximize productivity</p>
        </div>
        <div className="flex gap-4">
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /><span className="text-sm text-[color:var(--text)]">{user?.streak} day streak</span></div>
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" /><span className="text-sm text-[color:var(--text)]">{completedSessions} sessions</span></div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {Object.entries(sessionTypes).map(([key, { label }]) => (
          <button key={key} onClick={() => { setCurrentType(key as keyof typeof sessionTypes); setIsRunning(false); }} className={`px-4 py-2 rounded-xl text-sm font-medium ${currentType === key ? 'bg-primary/20 text-primary-light border border-primary/30' : 'text-text-dim hover:text-text'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-12">
        <div className="relative">
          <svg className="w-80 h-80 transform -rotate-90">
            <circle cx="160" cy="160" r="140" fill="none" stroke="var(--surface-2)" strokeWidth="12" />
            <circle cx="160" cy="160" r="140" fill="none" stroke="var(--primary)" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 140}`}
              strokeDashoffset={`${2 * Math.PI * 140 * (1 - ((sessionTypes[currentType].duration - timeLeft) / sessionTypes[currentType].duration))}`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-7xl font-mono font-bold text-[color:var(--text)]">{formatTime(timeLeft)}</span>
            <span className="text-[color:var(--text-dim)] mt-2">{sessionTypes[currentType].label}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-6">
        <button onClick={() => { setTimeLeft(sessionTypes[currentType].duration); setIsRunning(false); }} className="p-4 rounded-full bg-surface border border-border"><RotateCcw className="w-6 h-6 text-text-muted" /></button>
        <button onClick={() => setIsRunning(!isRunning)} className={`p-6 rounded-full text-white ${isRunning ? 'bg-red-500' : 'gradient-primary'}`}>
          {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <button className="p-4 rounded-full bg-surface border border-border"><Volume2 className="w-6 h-6 text-text-muted" /></button>
      </div>
    </div>
  )
}