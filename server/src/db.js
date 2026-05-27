import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', 'data')
const CONV_FILE = path.join(DATA_DIR, 'conversations.json')

async function ensureDir() {
  try {
    await fs.promises.mkdir(DATA_DIR, { recursive: true })
  } catch (e) {}
}

async function readConversations() {
  await ensureDir()
  try {
    const txt = await fs.promises.readFile(CONV_FILE, 'utf8')
    return JSON.parse(txt)
  } catch (e) {
    return {}
  }
}

async function writeConversations(obj) {
  await ensureDir()
  await fs.promises.writeFile(CONV_FILE, JSON.stringify(obj, null, 2), 'utf8')
}

export async function getConversation(id) {
  const all = await readConversations()
  return all[id] || []
}

export async function upsertConversation(id, messages) {
  const all = await readConversations()
  all[id] = messages
  await writeConversations(all)
}

export async function listConversations() {
  const all = await readConversations()
  return Object.keys(all)
}

// Groups persistence (stored in same file under special key)
export async function getGroups() {
  const all = await readConversations()
  return all.__groups__ || {}
}

export async function upsertGroup(id, group) {
  const all = await readConversations()
  const groups = all.__groups__ || {}
  groups[id] = group
  all.__groups__ = groups
  await writeConversations(all)
}

export async function getGroup(id) {
  const groups = await getGroups()
  return groups[id] || null
}

export async function listGroups() {
  const groups = await getGroups()
  return Object.values(groups)
}

export default { getConversation, upsertConversation, listConversations }
