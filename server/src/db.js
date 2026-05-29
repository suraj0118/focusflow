import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

export async function getConversation(id) {
  const doc = await db.collection('conversations').doc(id).get()
  return doc.exists ? doc.data().messages || [] : []
}

export async function upsertConversation(id, messages) {
  await db.collection('conversations').doc(id).set({ messages })
}

export async function listConversations() {
  const snapshot = await db.collection('conversations').get()
  return snapshot.docs.map(doc => doc.id)
}

export async function getGroups() {
  const snapshot = await db.collection('groups').get()
  const groups = {}
  snapshot.docs.forEach(doc => { groups[doc.id] = doc.data() })
  return groups
}

export async function upsertGroup(id, group) {
  await db.collection('groups').doc(id).set(group)
}

export async function getGroup(id) {
  const doc = await db.collection('groups').doc(id).get()
  return doc.exists ? doc.data() : null
}

export async function listGroups() {
  const snapshot = await db.collection('groups').get()
  return snapshot.docs.map(doc => doc.data())
}

export default { getConversation, upsertConversation, listConversations }