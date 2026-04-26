'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Habit } from '@/types/habit'
import type { Session } from '@/types/auth'
import {
  getSession,
  clearSession,
  getHabitsForUser,
  createHabit,
  updateHabit,
  deleteHabit,
} from '@/lib/storage'
import { toggleHabitCompletion } from '@/lib/habits'
import { validateHabitName } from '@/lib/validators'
import HabitCard from '@/components/habits/HabitCard'
import HabitForm from '@/components/habits/HabitForm'

export default function DashboardPage() {
  const router = useRouter()
  const [session,      setSession]      = useState<Session | null>(null)
  const [habits,       setHabits]       = useState<Habit[]>([])
  const [showForm,     setShowForm]     = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    const s = getSession()
    if (!s) {
      router.replace('/login')
      return
    }
    setSession(s)
    setHabits(getHabitsForUser(s.userId))
    setLoading(false)
  }, [router])

  const today = new Date().toISOString().slice(0, 10)

  const handleLogout = () => {
    clearSession()
    router.replace('/login')
  }

  const handleCreate = (name: string, description: string) => {
    if (!session) return
    const validation = validateHabitName(name)
    if (!validation.valid) return
    const habit = createHabit(session.userId, validation.value, description)
    setHabits((prev) => [...prev, habit])
    setShowForm(false)
  }

  const handleEdit = (name: string, description: string) => {
    if (!editingHabit) return
    const validation = validateHabitName(name)
    if (!validation.valid) return
    const updated: Habit = {
      ...editingHabit,
      name:        validation.value,
      description,
    }
    updateHabit(updated)
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)))
    setEditingHabit(null)
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    deleteHabit(id)
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  const handleToggleComplete = (habit: Habit) => {
    const updated = toggleHabitCompletion(habit, today)
    updateHabit(updated)
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)))
  }

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingHabit(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="animate-pulse-soft text-sage-500 font-display text-lg">
          Loading…
        </div>
      </div>
    )
  }

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-sage-50">
      {/* Header */}
      <header className="bg-white border-b border-sage-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-sage-800">
              Habit Tracker
            </h1>
            <p className="text-xs text-sage-500 mt-0.5">{session?.email}</p>
          </div>
          <button
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="text-sm text-sage-600 hover:text-sage-900 font-medium px-3 py-1.5 rounded-lg hover:bg-sage-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-500"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Create button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-semibold text-sage-800">
            My Habits
          </h2>
          <button
            data-testid="create-habit-button"
            onClick={() => { setEditingHabit(null); setShowForm(true) }}
            className="bg-sage-600 hover:bg-sage-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-800"
          >
            <span aria-hidden="true">+</span>
            New Habit
          </button>
        </div>

        {/* Habit form (inline) */}
        {showForm && (
          <HabitForm
            initial={editingHabit ?? undefined}
            onSave={editingHabit ? handleEdit : handleCreate}
            onCancel={closeForm}
          />
        )}

        {/* Habit list or empty state */}
        {habits.length === 0 && !showForm ? (
          <div
            data-testid="empty-state"
            className="text-center py-20 animate-fade-in"
          >
            <div className="text-5xl mb-4" aria-hidden="true">🌱</div>
            <h3 className="font-display text-xl font-semibold text-sage-700 mb-2">
              No habits yet
            </h3>
            <p className="text-sage-500 text-sm max-w-xs mx-auto">
              Click <strong>New Habit</strong> to start building your first streak.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {habits.map((habit) => (
              <li key={habit.id}>
                <HabitCard
                  habit={habit}
                  today={today}
                  onToggleComplete={handleToggleComplete}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
