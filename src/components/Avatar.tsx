import React from 'react'

function pickColor(seed: string) {
  const colors = ['#F97316', '#FB7185', '#60A5FA', '#34D399', '#F59E0B', '#A78BFA', '#F472B6']
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i)
  const idx = Math.abs(h) % colors.length
  return colors[idx]
}

function getInitials(name?: string) {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export default function Avatar({ name, size = 40 }: { name?: string; size?: number }) {
  const initials = getInitials(name)
  const bg = pickColor(name || initials)

  return (
    <div className="rounded-full flex items-center justify-center font-semibold text-white select-none" style={{ width: size, height: size, background: bg, border: '2px solid var(--border)' }}>
      <span style={{ fontSize: Math.floor(size / 2.6), lineHeight: 1 }}>{initials}</span>
    </div>
  )
}
