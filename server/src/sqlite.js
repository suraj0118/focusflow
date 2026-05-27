import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '..', 'data.db')

const db = new Database(DB_PATH)

// initialize tables
db.exec(`
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  messages TEXT
);
CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  data TEXT
);
`)

export function getConversation(id) {
  const row = db.prepare('SELECT messages FROM conversations WHERE id = ?').get(id)
  if (!row) return []
  try { return JSON.parse(row.messages) } catch (e) { return [] }
}

export function upsertConversation(id, messages) {
  const txt = JSON.stringify(messages || [])
  db.prepare('INSERT INTO conversations(id,messages) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET messages=excluded.messages').run(id, txt)
}

export function getGroup(id) {
  const row = db.prepare('SELECT data FROM groups WHERE id = ?').get(id)
  if (!row) return null
  try { return JSON.parse(row.data) } catch (e) { return null }
}

export function upsertGroup(id, group) {
  const txt = JSON.stringify(group || {})
  db.prepare('INSERT INTO groups(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').run(id, txt)
}

export function listGroups() {
  const rows = db.prepare('SELECT data FROM groups').all()
  return rows.map((r) => JSON.parse(r.data))
}

export default { getConversation, upsertConversation, getGroup, upsertGroup, listGroups }
