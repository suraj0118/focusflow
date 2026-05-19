import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { generateId } from '../lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AIAssistant() {
  const { isAILoading, setIsAILoading } = useStore()
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', role: 'assistant', content: 'Hello! I am your AI study assistant. Ask me anything about your studies!' }])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg: Message = { id: generateId(), role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsAILoading(true)

    setTimeout(() => {
      const responses = [
        'I can help you break down that task into smaller steps. Would you like me to create a study plan?',
        'That is a great topic! Let me explain the key concepts and generate some practice questions.',
        'I have analyzed your request. Here is what I recommend for optimal learning...',
      ]
      setMessages((prev) => [...prev, { id: generateId(), role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)] }])
      setIsAILoading(false)
    }, 1500)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">AI Study Assistant</h1>
        <p className="text-text-dim">Your personal AI tutor</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>}
            <div className={`max-w-[70%] ${msg.role === 'user' ? 'bg-primary/20 border border-primary/30' : 'glass'} rounded-2xl px-4 py-3`}>
              <p className="text-sm text-text-muted">{msg.content}</p>
            </div>
            {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center"><User className="w-4 h-4 text-text-muted" /></div>}
          </div>
        ))}
        {isAILoading && <div className="flex gap-3"><div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div><div className="glass rounded-2xl p-4"><Loader2 className="w-4 h-4 animate-spin text-text-dim" /></div></div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-end gap-3">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="Ask me anything..." rows={2} className="flex-1 bg-transparent text-text placeholder-text-dim resize-none focus:outline-none text-sm" />
          <button onClick={handleSend} disabled={!input.trim() || isAILoading} className="p-3 rounded-xl gradient-primary text-white disabled:opacity-50"><Send className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  )
}