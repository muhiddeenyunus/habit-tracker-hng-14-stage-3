import { describe, it, expect } from 'vitest'
import { getHabitSlug } from '@/lib/slug'

describe('getHabitSlug', () => {
  it('returns lowercase hyphenated slug for a basic habit name', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water')
    expect(getHabitSlug('Read Books')).toBe('read-books')
  })

  it('trims outer spaces and collapses repeated internal spaces', () => {
    expect(getHabitSlug('  Drink  Water  ')).toBe('drink-water')
    expect(getHabitSlug('  Go   To   Gym  ')).toBe('go-to-gym')
  })

  it('removes non alphanumeric characters except hyphens', () => {
    expect(getHabitSlug('Drink Water!')).toBe('drink-water')
    expect(getHabitSlug('Read & Write')).toBe('read-write')
    expect(getHabitSlug('10-minute Walk')).toBe('10-minute-walk')
  })
})
