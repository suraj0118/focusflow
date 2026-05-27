import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { updateProfile as firebaseUpdate } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY)

let app: ReturnType<typeof initializeApp> | null = null
let auth: ReturnType<typeof getAuth> | null = null
let db: ReturnType<typeof getFirestore> | null = null

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (e) {
    // initialization failed
    console.warn('Firebase init failed', e)
    app = null
    auth = null
    db = null
  }
}

export const firebaseAuth = auth
export const firebaseDB = db

export async function firebaseSignIn(email: string, password: string) {
  if (!auth) throw new Error('Firebase not configured')
  return signInWithEmailAndPassword(auth, email, password)
}

export async function firebaseSignUp(email: string, password: string) {
  if (!auth) throw new Error('Firebase not configured')
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function firebaseSignOut() {
  if (!auth) throw new Error('Firebase not configured')
  return signOut(auth)
}

export async function firebaseUpdateProfile(data: { displayName?: string; photoURL?: string }) {
  if (!auth || !auth.currentUser) throw new Error('Firebase not configured or no current user')
  return firebaseUpdate(auth.currentUser, data)
}

export function onFirebaseAuthStateChanged(cb: (user: FirebaseUser | null) => void) {
  if (!auth) return () => {}
  return onAuthStateChanged(auth, cb)
}
