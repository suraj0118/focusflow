import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Search, Bell, Moon, Sun, Check, Trophy, Info, AlertTriangle } from 'lucide-react'
import { formatTime } from '../lib/utils'

export default function TopBar() {
  const { notifications, markNotificationRead, clearNotifications } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-4 h-4 text-yellow-400" />
      case 'success': return <Check className="w-4 h-4 text-green-400" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-400" />
      default: return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  return (
    <header className="h-16 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
          <input type="text" placeholder="Search..." className="w-64 pl-10 pr-4 py-2 rounded-xl bg-background border border-border text-sm text-text placeholder-text-dim focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg hover:bg-surface-light">
          {isDark ? <Moon className="w-5 h-5 text-text-muted" /> : <Sun className="w-5 h-5 text-text-muted" />}
        </button>

        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg hover:bg-surface-light relative">
            <Bell className="w-5 h-5 text-text-muted" />
            {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{unreadCount}</span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-2xl shadow-2xl z-50">
                <div className="p-4 border-b border-border flex justify-between">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <button onClick={clearNotifications} className="text-xs text-text-dim">Clear all</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-3 border-b border-border/50 ${!n.read ? 'bg-primary/5' : ''}`} onClick={() => markNotificationRead(n.id)}>
                      <div className="flex items-start gap-2">
                        {getIcon(n.type)}
                        <div>
                          <p className="text-sm text-white">{n.title}</p>
                          <p className="text-xs text-text-dim">{n.message}</p>
                          <p className="text-[10px] text-text-dim">{formatTime(n.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}