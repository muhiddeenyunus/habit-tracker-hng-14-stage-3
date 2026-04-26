import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock next/navigation
const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

import LoginForm  from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import { saveUsers, getSession } from '@/lib/storage'
import type { User } from '@/types/auth'

const existingUser: User = {
  id:        'user-existing',
  email:     'test@example.com',
  password:  'password123',
  createdAt: '2024-01-01T00:00:00.000Z',
}

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear()
    mockReplace.mockClear()
  })

  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByTestId('auth-signup-email'),    'new@example.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'securepass')
    await user.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      const session = getSession()
      expect(session).not.toBeNull()
      expect(session?.email).toBe('new@example.com')
      expect(mockReplace).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows an error for duplicate signup email', async () => {
    saveUsers([existingUser])
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByTestId('auth-signup-email'),    'test@example.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'anypassword')
    await user.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('User already exists')
    })
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('submits the login form and stores the active session', async () => {
    saveUsers([existingUser])
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByTestId('auth-login-email'),    'test@example.com')
    await user.type(screen.getByTestId('auth-login-password'), 'password123')
    await user.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      const session = getSession()
      expect(session).not.toBeNull()
      expect(session?.userId).toBe('user-existing')
      expect(mockReplace).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows an error for invalid login credentials', async () => {
    saveUsers([existingUser])
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByTestId('auth-login-email'),    'test@example.com')
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpassword')
    await user.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password')
    })
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
