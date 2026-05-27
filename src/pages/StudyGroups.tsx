import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Users, Plus, Send, Phone, Timer } from 'lucide-react'
import Modal from '../components/Modal'

export default function StudyGroups() {
  const { user, addNotification } = useStore()
  const [groups, setGroups] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [createName, setCreateName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const streamRef = useRef<EventSource | null>(null)

  const email = (user as any)?.email || `guest@local`

  useEffect(() => {
    fetchGroups()
  }, [])

  useEffect(() => {
    if (!selectedGroup) return
    // load group messages and info
    fetch(`http://localhost:5000/groups/${selectedGroup}`).then((r) => r.json()).then((g) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetch(`http://localhost:5000/groups/${selectedGroup}/messages`).then((m) => m.json()).then((j) => setMessages(j.messages || []))
    })

    // open SSE
    const es = new EventSource(`http://localhost:5000/groups/${selectedGroup}/stream`)
    streamRef.current = es
    es.addEventListener('message', (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        setMessages((prev) => [...prev, msg])
      } catch (e) {}
    })
    es.addEventListener('members', (ev) => {
      // fetch group list to refresh member counts
      fetchGroups()
    })
    es.addEventListener('timer', (ev) => {
      // handle timer updates if desired
      // eslint-disable-next-line no-console
      console.log('timer', ev.data)
    })
    es.addEventListener('call', (ev) => {
      console.log('call', ev.data)
    })

    es.onerror = () => { es.close() }
    return () => { es.close() }
  }, [selectedGroup])

  const fetchGroups = async () => {
    try {
      const res = await fetch('http://localhost:5000/groups')
      const data = await res.json()
      setGroups(data)
    } catch (e) {}
  }

  const handleCreate = async () => {
    if (!createName.trim()) return
    try {
      const res = await fetch('http://localhost:5000/groups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: createName, email }) })
      const g = await res.json()
      setGroups((prev) => [g, ...prev])
      setShowCreate(false)
      setCreateName('')
      addNotification({ id: Date.now().toString(), type: 'success', title: 'Group created', message: `Created ${g.name}`, read: false, createdAt: new Date().toISOString() })
    } catch (e) {
      addNotification({ id: Date.now().toString(), type: 'warning', title: 'Create failed', message: 'Could not create group', read: false, createdAt: new Date().toISOString() })
    }
  }

  const handleJoin = async () => {
    if (!joinCode.trim()) return
    try {
      const res = await fetch('http://localhost:5000/groups/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, inviteCode: joinCode }) })
      const g = await res.json()
      // refresh groups
      fetchGroups()
      setShowJoin(false)
      addNotification({ id: Date.now().toString(), type: 'success', title: 'Joined group', message: `Joined ${g.name}`, read: false, createdAt: new Date().toISOString() })
    } catch (e) {
      addNotification({ id: Date.now().toString(), type: 'warning', title: 'Join failed', message: 'Could not join group', read: false, createdAt: new Date().toISOString() })
    }
  }

  const handleSend = async () => {
    if (!chatInput.trim() || !selectedGroup) return
    const text = chatInput.trim()
    setChatInput('')
    try {
      const res = await fetch(`http://localhost:5000/groups/${selectedGroup}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, text }) })
      const msg = await res.json()
      setMessages((prev) => [...prev, msg])
    } catch (e) {
      addNotification({ id: Date.now().toString(), type: 'warning', title: 'Send failed', message: 'Could not send message', read: false, createdAt: new Date().toISOString() })
    }
  }

  const toggleTimer = async (action: string) => {
    if (!selectedGroup) return
    await fetch(`http://localhost:5000/groups/${selectedGroup}/timer`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) })
  }

  const callAction = async (action: string) => {
    if (!selectedGroup) return
    await fetch(`http://localhost:5000/groups/${selectedGroup}/call`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, email }) })
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      <div className="w-80 flex-shrink-0">
        <h1 className="text-2xl font-bold text-[color:var(--text)] mb-4">Study Groups</h1>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setShowCreate(true)} className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Create</button>
          <button onClick={() => setShowJoin(true)} className="flex-1 px-4 py-2 rounded-xl bg-surface border border-border text-sm text-text-muted">Join</button>
        </div>
        {groups.map((group) => (
          <div key={group.id} onClick={() => setSelectedGroup(group.id)} className={`glass rounded-xl p-4 cursor-pointer mb-3 ${selectedGroup === group.id ? 'border-primary/50' : ''}`}>
            <h3 className="font-medium text-[color:var(--text)]">{group.name}</h3>
            <p className="text-xs text-text-dim">{group.members?.length || 0} members</p>
          </div>
        ))}
      </div>

      {selectedGroup ? (
        <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-[color:var(--text)]">{groups.find((g) => g.id === selectedGroup)?.name}</h2>
            <div className="flex gap-2">
              <button title="Start/Reset" onClick={() => toggleTimer('start')} className="p-2 rounded-lg bg-surface-light"><Timer className="w-4 h-4" /></button>
              <button title="Call" onClick={() => callAction('join')} className="p-2 rounded-lg bg-surface-light"><Phone className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-sm">{(msg.author || msg.userName || '').slice(0,2).toUpperCase()}</div>
                <div className="glass rounded-2xl px-4 py-3">
                  <p className="text-xs text-primary-light mb-1">{msg.author || msg.userName || 'Member'}</p>
                  <p className="text-sm text-text-muted">{msg.text || msg.content}</p>
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

      <Modal open={showCreate} title="Create Group" onClose={() => setShowCreate(false)}>
        <label className="block text-sm text-text-dim mb-2">Group name</label>
        <input className="input-field mb-4" value={createName} onChange={(e) => setCreateName(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded border border-border" onClick={() => setShowCreate(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleCreate}>Create</button>
        </div>
      </Modal>

      <Modal open={showJoin} title="Join Group" onClose={() => setShowJoin(false)}>
        <label className="block text-sm text-text-dim mb-2">Invite code</label>
        <input className="input-field mb-4" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded border border-border" onClick={() => setShowJoin(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleJoin}>Join</button>
        </div>
      </Modal>
    </div>
  )
}