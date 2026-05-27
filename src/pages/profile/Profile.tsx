import React, { useState } from 'react'
import { useStore } from '../../store/useStore'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../../components/Avatar'
import Modal from '../../components/Modal'

export default function Profile() {
  const { user, updateUser, addNotification } = useStore()
  const { loading, signOut } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [studyGoals, setStudyGoals] = useState(user?.studyGoals || '')
  const [dailyFocusTarget, setDailyFocusTarget] = useState<number | ''>(user?.dailyFocusTarget ?? '')
  const [saving, setSaving] = useState(false)

  if (loading) return null

  const { updateProfile } = useAuth()

  const save = async () => {
    if (!user) return
    setSaving(true)
    try {
      // optimistic local update
      updateUser({ name, bio, username, studyGoals, dailyFocusTarget: typeof dailyFocusTarget === 'number' ? dailyFocusTarget : undefined })
      await updateProfile({ name, bio, username, studyGoals, dailyFocusTarget: typeof dailyFocusTarget === 'number' ? dailyFocusTarget : undefined })
      addNotification({ id: Date.now().toString(), type: 'success', title: 'Profile saved', message: 'Your profile was updated', read: false, createdAt: new Date().toISOString() })
    } catch (e) {
      addNotification({ id: Date.now().toString(), type: 'warning', title: 'Save failed', message: 'Could not save profile to server', read: false, createdAt: new Date().toISOString() })
    } finally {
      setSaving(false)
    }
  }

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const doReset = async () => {
    if (!user) return
    // reset local store to defaults
    const defaultName = user.email ? user.email.split('@')[0] : 'User'
    updateUser({ name: defaultName, username: '', bio: '', studyGoals: '', dailyFocusTarget: 0 })
    try {
      await updateProfile({ name: defaultName, username: '', bio: '', studyGoals: '', dailyFocusTarget: 0 })
    } catch (e) {}
    setShowResetConfirm(false)
    addNotification({ id: Date.now().toString(), type: 'success', title: 'Profile reset', message: 'Your profile was reset to defaults', read: false, createdAt: new Date().toISOString() })
  }

  const handleSignOut = async () => {
    await signOut()
    setShowLogoutConfirm(false)
  }

  return (
    <>
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface rounded-2xl p-6 shadow-sm card-hover">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar name={name || user?.name} size={96} />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-semibold text-[color:var(--text)]">{name || user?.name}</h2>
                <p className="text-text-dim">Stay focused — your productivity companion</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-text-dim">
                  <div>🔥 <span className="font-semibold text-[color:var(--text)]">{user?.streak} day streak</span></div>
                  <div>📅 Joined <span className="text-[color:var(--text)]">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => setShowLogoutConfirm(true)} className="px-4 py-2 rounded border border-border text-sm hover:bg-surface-light">Sign Out</button>
                <button onClick={() => setShowResetConfirm(true)} className="px-4 py-2 rounded border border-border text-sm hover:bg-surface-light">Reset Profile</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-text-dim mb-2">Full Name</label>
                <input className="input-field" value={name} onChange={(e) => { setName(e.target.value); updateUser({ name: e.target.value }) }} placeholder="Your full name" />
              </div>

              <div>
                <label className="block text-sm text-text-dim mb-2">Username</label>
                <input className="input-field" value={username} onChange={(e) => { setUsername(e.target.value); }} placeholder="Your username (e.g., sauryax)" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-text-dim mb-2">Bio / About</label>
                <textarea className="input-field" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="A short description about you and your study goals" />
              </div>

              <div>
                <label className="block text-sm text-text-dim mb-2">Study Goals</label>
                <input className="input-field" value={studyGoals} onChange={(e) => setStudyGoals(e.target.value)} placeholder="E.g., Finish CS assignments, learn algorithms" />
              </div>

              <div>
                <label className="block text-sm text-text-dim mb-2">Daily Focus Target (minutes)</label>
                <input type="number" min={0} className="input-field" value={dailyFocusTarget} onChange={(e) => setDailyFocusTarget(e.target.value ? Number(e.target.value) : '')} placeholder="e.g., 90" />
              </div>
            </div>
        </div>
      </div>
    </div>
    <Modal open={showLogoutConfirm} title="Sign out" onClose={() => setShowLogoutConfirm(false)}>
      <p className="text-sm text-text-dim mb-4">Are you sure you want to sign out of FocusFlow?</p>
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 rounded border border-border" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
        <button className="btn-danger" onClick={handleSignOut}>Sign out</button>
      </div>
    </Modal>

    <Modal open={showResetConfirm} title="Reset profile" onClose={() => setShowResetConfirm(false)}>
      <p className="text-sm text-text-dim mb-4">Reset your profile to defaults? This will clear your username, bio and goals.</p>
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 rounded border border-border" onClick={() => setShowResetConfirm(false)}>Cancel</button>
        <button className="btn-danger" onClick={doReset}>Reset</button>
      </div>
    </Modal>
    </>
  )
}
