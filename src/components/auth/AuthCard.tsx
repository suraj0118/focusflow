import { motion } from 'framer-motion'

export default function AuthCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-md glass rounded-2xl p-8 ${className}`}>
      {children}
    </motion.div>
  )
}
