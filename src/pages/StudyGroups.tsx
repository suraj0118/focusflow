import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Users, Plus, Send, Phone, Timer } from 'lucide-react'

interface ChatMessage {
  id: string
  userName: string
  userAvatar: string
  content: string
}

const demoMessages: ChatMessage[] = [
  { id: '1', userName: 'Sarah Chen', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', content: 'Hey everyone! Ready for today\'s focus session?' },
  { id: '2', userName: 'Mike Ross', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', content: 'Absolutely! Working on Database normalization.' },
]

export default function StudyGroups() {
  const { studyGroups } = useStore()
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(demoMessages)

  const activeGroup = studyGroups.find((g) => g.id === selectedGroup)

  const handleSend = () => {
    if (!chatInput.trim()) return
    setMessages([...messages, { id: Date.now().toString(), userName: 'You', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', content: chatInput }])
    setChatInput('')
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      <div className="w-80 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white mb-4">Study Groups</h1>
        <div className="flex gap-2 mb-4">
          <button className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Create</button>
          <button className="flex-1 px-4 py-2 rounded-xl bg-surface border border-border text-sm text-text-muted">Join</button>
        </div>
        {studyGroups.map((group) => (
          <div key={group.id} onClick={() => setSelectedGroup(group.id)} className={`glass rounded-xl p-4 cursor-pointer mb-3 ${selectedGroup === group.id ? 'border-primary/50' : ''}`}>
            <h3 className="font-medium text-white">{group.name}</h3>
            <p className="text-xs text-text-dim">{group.members.length} members</p>
          </div>
        ))}
      </div>

      {activeGroup ? (
        <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-white">{activeGroup.name}</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-surface-light"><Timer className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg bg-surface-light"><Phone className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <img src={msg.userAvatar} alt={msg.userName} className="w-8 h-8 rounded-full" />
                <div className="glass rounded-2xl px-4 py-3">
                  <p className="text-xs text-primary-light mb-1">{msg.userName}</p>
                  <p className="text-sm text-text-muted">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border flex gap-3">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 input-field" />
            <button onClick={handleSend} className="p-3 rounded-xl gradient-primary text-white"><Send className="w-5 h-5" /></button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center"><Users className="w-16 h-16 text-text-dim" /></div>
      )}
    </div>
  )
}