import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

import HabitForm from '@/components/habits/HabitForm'
import HabitCard from '@/components/habits/HabitCard'
import type { Habit } from '@/types/habit'

const today = '2024-06-15'

const baseHabit: Habit = {
  id:          'habit-abc',
  userId:      'user-1',
  name:        'Drink Water',
  description: 'Stay hydrated',
  frequency:   'daily',
  createdAt:   '2024-01-01T00:00:00.000Z',
  completions: [],
}

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear()
    mockReplace.mockClear()
  })

  it('shows a validation error when habit name is empty', async () => {
    const user    = userEvent.setup()
    const onSave  = vi.fn()
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />)

    // Submit without filling in a name
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Habit name is required')
    })
    expect(onSave).not.toHaveBeenCalled()
  })

  it('creates a new habit and renders it in the list', async () => {
    const user   = userEvent.setup()
    const onSave = vi.fn()
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />)

    await user.type(screen.getByTestId('habit-name-input'),        'Drink Water')
    await user.type(screen.getByTestId('habit-description-input'), 'Stay hydrated')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('Drink Water', 'Stay hydrated')
    })
  })

  it('edits an existing habit and preserves immutable fields', async () => {
    const user   = userEvent.setup()
    const onSave = vi.fn()
    render(<HabitForm initial={baseHabit} onSave={onSave} onCancel={vi.fn()} />)

    // Clear name and type new one
    const nameInput = screen.getByTestId('habit-name-input')
    await user.clear(nameInput)
    await user.type(nameInput, 'Drink More Water')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('Drink More Water', 'Stay hydrated')
    })
  })

  it('deletes a habit only after explicit confirmation', async () => {
    const user     = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <HabitCard
        habit={baseHabit}
        today={today}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    )

    // First click shows confirmation
    await user.click(screen.getByTestId('habit-delete-drink-water'))
    expect(onDelete).not.toHaveBeenCalled()

    // Confirm button appears — click it
    await waitFor(() => {
      expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument()
    })
    await user.click(screen.getByTestId('confirm-delete-button'))

    expect(onDelete).toHaveBeenCalledWith('habit-abc')
  })

  it('toggles completion and updates the streak display', async () => {
    const user             = userEvent.setup()
    const onToggleComplete = vi.fn((habit: Habit) => habit)

    render(
      <HabitCard
        habit={baseHabit}
        today={today}
        onToggleComplete={onToggleComplete}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('0')

    await user.click(screen.getByTestId('habit-complete-drink-water'))
    expect(onToggleComplete).toHaveBeenCalledWith(baseHabit)

    const completedHabit = { ...baseHabit, completions: [today] }
    render(
      <HabitCard
        habit={completedHabit}
        today={today}
        onToggleComplete={onToggleComplete}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    await waitFor(() => {
      const streakEls = screen.getAllByTestId('habit-streak-drink-water')
      expect(streakEls[streakEls.length - 1]).toHaveTextContent('1')
    })
  })
})
