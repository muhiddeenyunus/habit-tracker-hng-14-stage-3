'use client'

import { useState } from 'react'
import type { Habit } from '@/types/habit'
import { getHabitSlug } from '@/lib/slug'
import { calculateCurrentStreak } from '@/lib/streaks'

interface HabitCardProps {
  habit:            Habit
  today:            string
  onToggleComplete: (habit: Habit) => void
  onEdit:           (habit: Habit) => void
  onDelete:         (id: string)   => void
}

export default function HabitCard({
  habit,
  today,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const slug      = getHabitSlug(habit.name)
  const streak    = calculateCurrentStreak(habit.completions, today)
  const completed = habit.completions.includes(today)

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete(habit.id)
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`bg-white rounded-2xl border transition-all shadow-sm p-5 ${
        completed
          ? 'border-sage-300 bg-sage-50'
          : 'border-sage-100'
      }`}
    >
      {/* Top row: name + streak */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-display font-semibold text-base truncate ${
            completed ? 'text-sage-700 line-through decoration-sage-400' : 'text-sage-900'
          }`}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sage-500 text-xs mt-0.5 truncate">{habit.description}</p>
          )}
        </div>

        {/* Streak badge */}
        <div
          data-testid={`habit-streak-${slug}`}
          className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1 shrink-0"
          aria-label={`Current streak: ${streak} day${streak !== 1 ? 's' : ''}`}
        >
          <span className="text-sm" aria-hidden="true">🔥</span>
          <span className="text-amber-700 font-semibold text-sm">{streak}</span>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-2">
        {/* Complete toggle */}
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit)}
          aria-pressed={completed}
          aria-label={completed ? `Unmark ${habit.name} as complete` : `Mark ${habit.name} as complete`}
          className={`flex-1 text-sm font-medium rounded-xl py-2 transition-colors focus-visible:outline focus-visible:outline-2 ${
            completed
              ? 'bg-sage-200 text-sage-800 hover:bg-sage-300 focus-visible:outline-sage-600'
              : 'bg-sage-600 text-white hover:bg-sage-700 focus-visible:outline-sage-800'
          }`}
        >
          {completed ? '✓ Done today' : 'Mark complete'}
        </button>

        {/* Edit */}
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          aria-label={`Edit ${habit.name}`}
          className="p-2 rounded-xl text-sage-500 hover:text-sage-700 hover:bg-sage-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>

        {/* Delete */}
        {confirmDelete ? (
          <div className="flex gap-1">
            <button
              data-testid="confirm-delete-button"
              onClick={handleDelete}
              aria-label={`Confirm delete ${habit.name}`}
              className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-800"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              aria-label="Cancel delete"
              className="px-3 py-2 rounded-xl border border-sage-200 text-sage-600 text-xs font-medium hover:bg-sage-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirmDelete(true)}
            aria-label={`Delete ${habit.name}`}
            className="p-2 rounded-xl text-sage-400 hover:text-red-500 hover:bg-red-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
