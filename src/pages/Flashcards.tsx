import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { BookOpen, Plus, Brain, Sparkles, Trophy, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { generateId } from '../lib/utils'

export default function Flashcards() {
  const { flashcards, addFlashcard, reviewFlashcard } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [studyMode, setStudyMode] = useState(false)
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 })
  const [showComplete, setShowComplete] = useState(false)
  const [newCard, setNewCard] = useState({ question: '', answer: '', subject: '', difficulty: 'medium' as 'easy' | 'medium' | 'hard' })

  const currentCard = flashcards[currentIndex]

  const handleNext = () => { setIsFlipped(false); setTimeout(() => setCurrentIndex((p) => (p + 1) % flashcards.length), 200) }
  const handlePrev = () => { setIsFlipped(false); setTimeout(() => setCurrentIndex((p) => (p - 1 + flashcards.length) % flashcards.length), 200) }

  const handleReview = (correct: boolean) => {
    if (currentCard) reviewFlashcard(currentCard.id)
    setStats((p) => ({ correct: p.correct + (correct ? 1 : 0), incorrect: p.incorrect + (correct ? 0 : 1), total: p.total + 1 }))
    if (stats.total + 1 >= flashcards.length) setShowComplete(true)
    else handleNext()
  }

  const handleAdd = () => {
    if (!newCard.question.trim() || !newCard.answer.trim()) return
    addFlashcard({ id: generateId(), question: newCard.question, answer: newCard.answer, source: 'manual', subject: newCard.subject, difficulty: newCard.difficulty, userId: 'user-1', createdAt: new Date().toISOString(), reviewCount: 0 })
    setNewCard({ question: '', answer: '', subject: '', difficulty: 'medium' })
    setShowAdd(false)
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <BookOpen className="w-16 h-16 text-text-dim mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Flashcards Yet</h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Flashcard</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Flashcards</h1>
          <p className="text-text-dim">Review and master your concepts</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-surface border border-border text-sm text-text-muted hover:text-white"><Plus className="w-4 h-4 inline mr-1" /> Add</button>
          <button onClick={() => { setStudyMode(true); setStats({ correct: 0, incorrect: 0, total: 0 }); }} className="btn-primary flex items-center gap-2"><Brain className="w-4 h-4" /> Study</button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl mb-4">
          <div className="flex justify-between text-xs text-text-dim mb-2">
            <span>Card {currentIndex + 1} of {flashcards.length}</span>
          </div>
          <div className="h-1 bg-background rounded-full"><motion.div className="h-full gradient-primary rounded-full" animate={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }} /></div>
        </div>

        <div className="relative w-full max-w-2xl h-80 perspective-1000">
          <motion.div className="w-full h-full relative cursor-pointer" onClick={() => setIsFlipped(!isFlipped)} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6 }} style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 glass rounded-2xl p-8 flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
              <Brain className="w-8 h-8 text-primary-light mb-4" />
              <h3 className="text-xl font-semibold text-white text-center">{currentCard?.question}</h3>
              <p className="text-sm text-text-dim mt-4">Click to reveal</p>
            </div>
            <div className="absolute inset-0 glass rounded-2xl p-8 flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <Sparkles className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-lg text-white text-center">{currentCard?.answer}</h3>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button onClick={handlePrev} className="p-3 rounded-full bg-surface border border-border"><ChevronLeft className="w-5 h-5" /></button>
          {studyMode ? (
            <div className="flex gap-3">
              <button onClick={() => handleReview(false)} className="px-6 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30"><X className="w-4 h-4 inline mr-1" /> Need Review</button>
              <button onClick={() => handleReview(true)} className="px-6 py-3 rounded-xl bg-secondary/20 text-secondary border border-secondary/30"><Check className="w-4 h-4 inline mr-1" /> Got It!</button>
            </div>
          ) : (
            <button onClick={() => setIsFlipped(!isFlipped)} className="px-8 py-3 rounded-xl gradient-primary text-white">{isFlipped ? 'Show Question' : 'Reveal Answer'}</button>
          )}
          <button onClick={handleNext} className="p-3 rounded-full bg-surface border border-border"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <AnimatePresence>
        {showComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-surface border border-border rounded-2xl p-8 text-center max-w-md">
              <Trophy className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Session Complete!</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-surface-light rounded-xl p-3"><p className="text-2xl font-bold text-secondary">{stats.correct}</p><p className="text-xs text-text-dim">Correct</p></div>
                <div className="bg-surface-light rounded-xl p-3"><p className="text-2xl font-bold text-red-400">{stats.incorrect}</p><p className="text-xs text-text-dim">Review</p></div>
                <div className="bg-surface-light rounded-xl p-3"><p className="text-2xl font-bold text-primary-light">{Math.round((stats.correct / stats.total) * 100) || 0}%</p><p className="text-xs text-text-dim">Accuracy</p></div>
              </div>
              <button onClick={() => { setShowComplete(false); setStudyMode(false); }} className="btn-primary w-full">Continue</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold text-white mb-4">Add Flashcard</h2>
              <textarea value={newCard.question} onChange={(e) => setNewCard({ ...newCard, question: e.target.value })} placeholder="Question" rows={2} className="input-field resize-none mb-3" />
              <textarea value={newCard.answer} onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })} placeholder="Answer" rows={2} className="input-field resize-none mb-3" />
              <div className="flex gap-3">
                <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-3 rounded-xl bg-surface-light text-text-muted">Cancel</button>
                <button onClick={handleAdd} className="flex-1 btn-primary">Add</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}