import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const file = path.join(__dirname, '..', 'data', 'db.json')
const adapter = new JSONFile(file)
// provide default data to satisfy lowdb requirement
const db = new Low(adapter, { conversations: {}, groups: {}, tasks: {}, sessions: [] })

async function ensure() {
  await db.read()
  db.data = db.data || { conversations: {}, groups: {} }
}

export async function getConversation(id) {
  await ensure()
  return db.data.conversations[id] || []
}

export async function upsertConversation(id, messages) {
  await ensure()
  db.data.conversations[id] = messages
  await db.write()
}

export async function getGroup(id) {
  await ensure()
  return db.data.groups[id] || null
}

export async function upsertGroup(id, group) {
  await ensure()
  db.data.groups[id] = group
  await db.write()
}

export async function listGroups() {
  await ensure()
  return Object.values(db.data.groups || {})
}

// Tasks
export async function listTasks() {
  await ensure()
  return Object.values(db.data.tasks || {})
}

export async function getTask(id) {
  await ensure()
  return db.data.tasks[id] || null
}

export async function upsertTask(id, task) {
  await ensure()
  db.data.tasks[id] = task
  await db.write()
}

export async function deleteTask(id) {
  await ensure()
  if (db.data.tasks && db.data.tasks[id]) {
    delete db.data.tasks[id]
    await db.write()
    return true
  }
  return false
}

// Sessions
export async function listSessions() {
  await ensure()
  return db.data.sessions || []
}

export async function addSession(session) {
  await ensure()
  db.data.sessions = db.data.sessions || []
  db.data.sessions.push(session)
  await db.write()
}

export async function clearSessions() {
  await ensure()
  db.data.sessions = []
  await db.write()
}

export default { getConversation, upsertConversation, getGroup, upsertGroup, listGroups }
