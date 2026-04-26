'use client'

import { useState, type FormEvent } from 'react'
import type { Habit } from '@/types/habit'
import { validateHabitName } from '@/lib/validators'

interface HabitFormProps {
  initial?:  Habit
  onSave:    (name: string, description: string) => void
  onCancel:  () => void
}

export default function HabitForm({ initial, onSave, onCancel }: HabitFormProps) {
  const [name,        setName]        = useState(initial?.name        ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [nameError,   setNameError]   = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validation = validateHabitName(name)
    if (!validation.valid) {
      setNameError(validation.error)
      return
    }
    setNameError(null)
    onSave(validation.value, description.trim())
  }

  return (
    <div
      data-testid="habit-form"
      className="bg-white rounded-2xl border border-sage-200 p-6 mb-4 shadow-sm animate-slide-up"
    >
      <h3 className="font-display text-lg font-semibold text-sage-800 mb-5">
        {initial ? 'Edit Habit' : 'New Habit'}
      </h3>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label
            htmlFor="habit-name"
            className="block text-sm font-medium text-sage-700"
          >
            Habit name <span aria-hidden="true" className="text-red-400">*</span>
          </label>
          <input
            id="habit-name"
            data-testid="habit-name-input"
            type="text"
            required
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError(null) }}
            aria-invalid={nameError ? 'true' : 'false'}
            aria-describedby={nameError ? 'habit-name-error' : undefined}
            className={`w-full border rounded-xl px-4 py-3 text-sm text-sage-900 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${
              nameError
                ? 'border-red-300 focus:ring-red-400'
                : 'border-sage-200 focus:ring-sage-400'
            }`}
            placeholder="e.g. Drink Water"
          />
          {nameError && (
            <p
              id="habit-name-error"
              role="alert"
              className="text-red-600 text-xs mt-1"
            >
              {nameError}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label
            htmlFor="habit-description"
            className="block text-sm font-medium text-sage-700"
          >
            Description{' '}
            <span className="text-sage-400 font-normal">(optional)</span>
          </label>
          <input
            id="habit-description"
            data-testid="habit-description-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-sage-200 rounded-xl px-4 py-3 text-sm text-sage-900 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition"
            placeholder="A short description"
          />
        </div>

        {/* Frequency (fixed to daily per spec) */}
        <div className="space-y-1">
          <label
            htmlFor="habit-frequency"
            className="block text-sm font-medium text-sage-700"
          >
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            disabled
            className="w-full border border-sage-200 rounded-xl px-4 py-3 text-sm text-sage-500 bg-sage-50 cursor-not-allowed"
            defaultValue="daily"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            data-testid="habit-save-button"
            type="submit"
            className="flex-1 bg-sage-600 hover:bg-sage-700 text-white text-sm font-medium rounded-xl py-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-800"
          >
            {initial ? 'Save changes' : 'Create habit'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-sage-200 text-sage-700 hover:bg-sage-50 text-sm font-medium rounded-xl py-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
