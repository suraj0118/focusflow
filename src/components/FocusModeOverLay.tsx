import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { X, Play, Pause, RotateCcw } from 'lucide-react'

export default function FocusModeOverlay() {
  const { toggleFocusMode, focusSubject } = useStore()
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((p) => p - 1), 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, timeLeft])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center">
      <button onClick={toggleFocusMode} className="absolute top-6 right-6 p-3 rounded-full bg-surface border border-border"><X className="w-5 h-5 text-text-muted" /></button>
      {focusSubject && <span className="badge-primary mb-8">Focusing on: {focusSubject}</span>}
      
      <div className="relative mb-12">
        <svg className="w-72 h-72 transform -rotate-90">
          <circle cx="144" cy="144" r="130" fill="none" stroke="#1E293B" strokeWidth="12" />
          <circle cx="144" cy="144" r="130" fill="none" stroke="#6366F1" strokeWidth="12" strokeLinecap="round" 
            strokeDasharray={`${2 * Math.PI * 130}`} 
            strokeDashoffset={`${2 * Math.PI * 130 * (1 - ((25 * 60 - timeLeft) / (25 * 60)))}`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-mono font-bold text-white">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={() => { setTimeLeft(25 * 60); setIsRunning(false); }} className="p-3 rounded-full bg-surface border border-border"><RotateCcw className="w-5 h-5" /></button>
        <button onClick={() => setIsRunning(!isRunning)} className={`p-6 rounded-full text-white ${isRunning ? 'bg-red-500' : 'gradient-primary'}`}>
          {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
      </div>
    </motion.div>
  )
}