import { describe, it, expect } from 'vitest'
import { validateHabitName } from '@/lib/validators'

describe('validateHabitName', () => {
  it('returns an error when habit name is empty', () => {
    expect(validateHabitName('')).toEqual({
      valid: false,
      value: '',
      error: 'Habit name is required',
    })
    expect(validateHabitName('   ')).toEqual({
      valid: false,
      value: '',
      error: 'Habit name is required',
    })
  })

  it('returns an error when habit name exceeds 60 characters', () => {
    const long = 'a'.repeat(61)
    const result = validateHabitName(long)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Habit name must be 60 characters or fewer')
  })

  it('returns a trimmed value when habit name is valid', () => {
    expect(validateHabitName('  Drink Water  ')).toEqual({
      valid: true,
      value: 'Drink Water',
      error: null,
    })
    expect(validateHabitName('Read Books')).toEqual({
      valid: true,
      value: 'Read Books',
      error: null,
    })
  })
})
