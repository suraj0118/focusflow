import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Plus, CheckCircle2, Circle, Trash2, Sparkles } from 'lucide-react'
import { formatDate, getPriorityColor, getPriorityLabel, generateId } from '../lib/utils'

const priorities = [
  { value: 'urgent-important', label: 'Do First' },
  { value: 'urgent-not-important', label: 'Delegate' },
  { value: 'not-urgent-important', label: 'Schedule' },
  { value: 'not-urgent-not-important', label: 'Eliminate' },
]

export default function Tasks() {
  const { tasks, addTask, completeTask, deleteTask } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'not-urgent-important' as any, subject: '', estimatedMinutes: 30 })

  const handleAdd = () => {
    if (!newTask.title.trim()) return
    addTask({
      id: generateId(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      subject: newTask.subject,
      estimatedMinutes: newTask.estimatedMinutes,
      status: 'pending',
      userId: 'user-1',
      createdAt: new Date().toISOString(),
    })
    setNewTask({ title: '', description: '', priority: 'not-urgent-important', subject: '', estimatedMinutes: 30 })
    setShowAdd(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text)]">Tasks</h1>
          <p className="text-text-dim">Manage your tasks with AI-powered breakdowns</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Task</button>
      </div>

      <div className="space-y-3">
        {tasks.filter((t) => t.status !== 'completed').map((task) => (
          <motion.div key={task.id} layout className="glass rounded-xl p-4 flex items-start gap-4">
            <button onClick={() => completeTask(task.id)} className="mt-1 text-text-dim hover:text-secondary"><Circle className="w-5 h-5" /></button>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-[color:var(--text)]">{task.title}</h3>
                <span className={`badge ${getPriorityColor(task.priority)}`}>{getPriorityLabel(task.priority)}</span>
              </div>
              <p className="text-sm text-text-dim mt-1">{task.description}</p>
            </div>
            <button onClick={() => deleteTask(task.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-dim"><Trash2 className="w-4 h-4" /></button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold text-[color:var(--text)] mb-4">Create New Task</h2>
              <input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title" className="input-field mb-3" />
              <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Description" rows={2} className="input-field resize-none mb-3" />
              <div className="grid grid-cols-2 gap-3 mb-4">
                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="input-field">
                  {priorities.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
                <input type="number" value={newTask.estimatedMinutes} onChange={(e) => setNewTask({ ...newTask, estimatedMinutes: parseInt(e.target.value) || 0 })} className="input-field" placeholder="Minutes" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-3 rounded-xl bg-surface-light text-text-muted">Cancel</button>
                <button onClick={handleAdd} className="flex-1 btn-primary">Create</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}