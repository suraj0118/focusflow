import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { getConversation, upsertConversation, getGroup, upsertGroup, listGroups, listTasks, getTask, upsertTask, deleteTask, listSessions, addSession } from './db_lowdb.js'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// AI chat functionality removed from this server build.

// Gracefully handle invalid JSON bodies to avoid crashing the server
app.use((err, req, res, next) => {
  if (!err) return next()
  // body-parser uses a SyntaxError for invalid JSON
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' })
  }
  next(err)
})

const users = new Map()
// (Removed) SSE clients per conversationId
// SSE clients per groupId
const sseGroupClients = new Map()

const generateToken = () => Math.random().toString(36).slice(2)
const getUserByToken = (token) => [...users.values()].find((user) => user.token === token)

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token || !getUserByToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

app.post('/auth/register', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (users.has(email)) {
    return res.status(409).json({ error: 'User already exists' })
  }

  const token = generateToken()
  const defaultName = email.split('@')[0]
    users.set(email, { email, password, token, name: defaultName, avatar: null, bio: '', username: '', studyGoals: '', dailyFocusTarget: 0, createdAt: new Date().toISOString() })
  res.status(201).json({ email, token })
})

// return current user profile (requires auth)
app.get('/user', authMiddleware, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  const user = getUserByToken(token)
  if (!user) return res.status(404).json({ error: 'User not found' })
    const { email, name, avatar, bio, createdAt, username, studyGoals, dailyFocusTarget } = user
    res.json({ email, name, avatar, bio, createdAt, username, studyGoals, dailyFocusTarget })
})

// update profile (requires auth)
app.put('/user', authMiddleware, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  const user = getUserByToken(token)
  if (!user) return res.status(404).json({ error: 'User not found' })
    const { name, avatar, bio, username, studyGoals, dailyFocusTarget } = req.body
  if (name) user.name = name
    // avatar intentionally ignored; generated from name on client
  if (typeof bio !== 'undefined') user.bio = bio
    if (typeof username !== 'undefined') user.username = username
    if (typeof studyGoals !== 'undefined') user.studyGoals = studyGoals
    if (typeof dailyFocusTarget !== 'undefined') user.dailyFocusTarget = dailyFocusTarget
    res.json({ email: user.email, name: user.name, avatar: user.avatar, bio: user.bio, username: user.username, studyGoals: user.studyGoals, dailyFocusTarget: user.dailyFocusTarget })
})

// Public profile update for development (no auth) - matches by email
app.put('/user/public', (req, res) => {
  const { email, name, avatar, bio } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })
  const existing = users.get(email)
  if (existing) {
    if (name) existing.name = name
    if (typeof bio !== 'undefined') existing.bio = bio
    if (typeof req.body.username !== 'undefined') existing.username = req.body.username
    if (typeof req.body.studyGoals !== 'undefined') existing.studyGoals = req.body.studyGoals
    if (typeof req.body.dailyFocusTarget !== 'undefined') existing.dailyFocusTarget = req.body.dailyFocusTarget
    users.set(email, existing)
    return res.json({ email: existing.email, name: existing.name, avatar: existing.avatar, bio: existing.bio, username: existing.username, studyGoals: existing.studyGoals, dailyFocusTarget: existing.dailyFocusTarget })
  }

  const token = generateToken()
  const newUser = { email, password: null, token, name: name || email.split('@')[0], avatar: null, bio: bio || '', username: req.body.username || '', studyGoals: req.body.studyGoals || '', dailyFocusTarget: req.body.dailyFocusTarget || 0, createdAt: new Date().toISOString() }
  users.set(email, newUser)
  res.json({ email: newUser.email, name: newUser.name, avatar: newUser.avatar, bio: newUser.bio, username: newUser.username, studyGoals: newUser.studyGoals, dailyFocusTarget: newUser.dailyFocusTarget })
})

// Public profile fetch by email
app.get('/user/public', (req, res) => {
  const email = req.query.email
  if (!email) return res.status(400).json({ error: 'Email query required' })
  const user = users.get(email)
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json({ email: user.email, name: user.name, avatar: user.avatar, bio: user.bio, createdAt: user.createdAt, username: user.username, studyGoals: user.studyGoals, dailyFocusTarget: user.dailyFocusTarget })
})

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  const user = users.get(email)

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  user.token = generateToken()
  res.json({ email: user.email, token: user.token })
})

app.post('/auth/refresh', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  const user = getUserByToken(token)

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  user.token = generateToken()
  res.json({ token: user.token })
})

app.post('/auth/logout', authMiddleware, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  const user = getUserByToken(token)

  if (user) {
    user.token = null
  }

  res.status(204).end()
})

// AI chat endpoints removed.

// Conversation history endpoint removed.

// AI SSE stream removed.

// Groups API
app.post('/groups', async (req, res) => {
  const { name, email } = req.body
  if (!name || !email) return res.status(400).json({ error: 'name and email required' })
  const id = `g_${Date.now().toString(36)}`
  const inviteCode = Math.random().toString(36).slice(2, 8)
  const group = { id, name, inviteCode, createdBy: email, members: [email], messages: [], timer: { running: false, remaining: 0 }, call: { active: false, participants: [] }, createdAt: new Date().toISOString() }
  await upsertGroup(id, group)
  res.status(201).json(group)
})

app.get('/groups', async (req, res) => {
  const groups = await listGroups()
  res.json(groups)
})

app.get('/groups/:id', async (req, res) => {
  const g = await getGroup(req.params.id)
  if (!g) return res.status(404).json({ error: 'Group not found' })
  res.json(g)
})

app.post('/groups/join', async (req, res) => {
  const { email, inviteCode } = req.body
  if (!email || !inviteCode) return res.status(400).json({ error: 'email and inviteCode required' })
  const groups = await listGroups()
  const group = groups.find((g) => g.inviteCode === inviteCode)
  if (!group) return res.status(404).json({ error: 'Group not found' })
  if (!group.members.includes(email)) {
    group.members.push(email)
    await upsertGroup(group.id, group)
    // notify SSE clients
    const clients = sseGroupClients.get(group.id)
    if (clients) for (const r of clients) {
      r.write(`event: members\n`)
      r.write(`data: ${JSON.stringify(group.members)}\n\n`)
    }
  }
  res.json(group)
})

app.post('/groups/:id/messages', async (req, res) => {
  const { id } = req.params
  const { email, text } = req.body
  if (!email || !text) return res.status(400).json({ error: 'email and text required' })
  const group = await getGroup(id)
  if (!group) return res.status(404).json({ error: 'Group not found' })
  const msg = { id: `m_${Date.now().toString(36)}`, author: email, text, createdAt: new Date().toISOString() }
  group.messages = group.messages || []
  group.messages.push(msg)
  await upsertGroup(id, group)
  // notify SSE clients
  const clients = sseGroupClients.get(id)
  if (clients) for (const r of clients) {
    r.write(`event: message\n`)
    r.write(`data: ${JSON.stringify(msg)}\n\n`)
  }
  res.status(201).json(msg)
})

app.get('/groups/:id/messages', async (req, res) => {
  const group = await getGroup(req.params.id)
  if (!group) return res.status(404).json({ error: 'Group not found' })
  res.json({ messages: group.messages || [] })
})

// Group SSE stream: members, messages, timer, call events
app.get('/groups/:id/stream', async (req, res) => {
  const id = req.params.id
  const group = await getGroup(id)
  if (!group) return res.status(404).json({ error: 'Group not found' })

  res.writeHead(200, {
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
  })
  res.write(': connected\n\n')

  const set = sseGroupClients.get(id) || new Set()
  set.add(res)
  sseGroupClients.set(id, set)

  req.on('close', () => {
    set.delete(res)
  })
})

app.post('/groups/:id/timer', async (req, res) => {
  const id = req.params.id
  const { action, duration } = req.body
  const group = await getGroup(id)
  if (!group) return res.status(404).json({ error: 'Group not found' })
  if (action === 'start') {
    group.timer.running = true
    group.timer.remaining = typeof duration === 'number' ? duration : group.timer.remaining || 1500
  } else if (action === 'pause') {
    group.timer.running = false
  } else if (action === 'reset') {
    group.timer.running = false
    group.timer.remaining = typeof duration === 'number' ? duration : 0
  }
  await upsertGroup(id, group)
  const clients = sseGroupClients.get(id)
  if (clients) for (const r of clients) {
    r.write(`event: timer\n`)
    r.write(`data: ${JSON.stringify(group.timer)}\n\n`)
  }
  res.json({ timer: group.timer })
})

// Group call signaling (simple)
app.post('/groups/:id/call', async (req, res) => {
  const id = req.params.id
  const { action, email } = req.body
  const group = await getGroup(id)
  if (!group) return res.status(404).json({ error: 'Group not found' })
  if (!group.call) group.call = { active: false, participants: [] }
  if (action === 'join') {
    if (!group.call.participants.includes(email)) group.call.participants.push(email)
    group.call.active = true
  } else if (action === 'leave') {
    group.call.participants = group.call.participants.filter((p) => p !== email)
    if (group.call.participants.length === 0) group.call.active = false
  } else if (action === 'end') {
    group.call.active = false
    group.call.participants = []
  }
  await upsertGroup(id, group)
  const clients = sseGroupClients.get(id)
  if (clients) for (const r of clients) {
    r.write(`event: call\n`)
    r.write(`data: ${JSON.stringify(group.call)}\n\n`)
  }
  res.json({ call: group.call })
})

app.use('/tasks', authMiddleware)

app.post('/tasks', async (req, res) => {
  const { title, userId, status } = req.body
  if (!title) return res.status(400).json({ error: 'Task title is required' })

  const id = Date.now().toString()
  const task = { id, title, userId: userId || null, status: status || 'todo', createdAt: new Date().toISOString() }
  await upsertTask(id, task)
  res.status(201).json(task)
})

app.get('/tasks', async (req, res) => {
  const tasksList = await listTasks()
  res.json(tasksList)
})

app.put('/tasks/:id', async (req, res) => {
  const existing = await getTask(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Task not found' })
  const updated = { ...existing, ...req.body }
  await upsertTask(req.params.id, updated)
  res.json(updated)
})

app.delete('/tasks/:id', async (req, res) => {
  const ok = await deleteTask(req.params.id)
  if (!ok) return res.status(404).json({ error: 'Task not found' })
  res.status(204).end()
})

app.use('/sessions', authMiddleware)

app.post('/sessions', async (req, res) => {
  const session = { id: Date.now().toString(), ...req.body }
  await addSession(session)
  res.status(201).json(session)
})

app.get('/sessions/analytics', async (req, res) => {
  const sessions = await listSessions()
  res.json({ count: sessions.length })
})

// Return raw sessions (for frontend plotting). Requires auth in prod but exposed for dev.
app.get('/sessions', async (req, res) => {
  const sessions = await listSessions()
  res.json({ sessions })
})

// Analytics summary endpoint (per-user if email query provided)
app.get('/analytics', async (req, res) => {
  const email = req.query.email
  const sessionsAll = await listSessions()
  const userSessions = email ? sessionsAll.filter((s) => s.userId === email) : sessionsAll

  const totalFocusMinutes = userSessions.reduce((sum, s) => sum + (s.duration || 0), 0)

  const scores = userSessions.map((s) => typeof s.score === 'number' ? s.score : null).filter(Boolean)
  const avgFocusScore = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0

  const allTasks = await listTasks()
  const userTasks = email ? allTasks.filter((t) => t.userId === email || !t.userId) : allTasks
  const tasksCompleted = userTasks.filter((t) => t.status === 'completed').length

  const byDay = {}
  for (const s of userSessions) {
    if (!s.startedAt) continue
    const d = new Date(s.startedAt).toISOString().slice(0, 10)
    byDay[d] = (byDay[d] || 0) + 1
  }
  const today = new Date()
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    if (byDay[key]) streak++
    else break
  }

  const weekly = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const daySessions = userSessions.filter((s) => s.startedAt && s.startedAt.startsWith(key))
    weekly.push({ day: d.toLocaleDateString(undefined, { weekday: 'short' }), focus: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0), score: (daySessions.reduce((a, b) => a + (b.score || 0), 0) / (daySessions.length || 1)) })
  }

  res.json({ totalFocusMinutes, tasksCompleted, avgFocusScore, streak, weekly })
})

export { app }
