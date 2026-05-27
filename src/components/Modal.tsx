import React from 'react'

export default function Modal({ open, title, children, onClose }: { open: boolean; title?: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl p-6 w-full max-w-md border border-border">
        {title && <h3 className="text-lg font-semibold text-[color:var(--text)] mb-2">{title}</h3>}
        <div>{children}</div>
      </div>
    </div>
  )
}
