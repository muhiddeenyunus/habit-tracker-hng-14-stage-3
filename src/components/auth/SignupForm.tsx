'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { findUserByEmail, createUser, saveSession } from '@/lib/storage'

export default function SignupForm() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [busy,     setBusy]     = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setError('Email and password are required')
      setBusy(false)
      return
    }

    // Reject duplicate email
    const existing = findUserByEmail(trimmedEmail)
    if (existing) {
      setError('User already exists')
      setBusy(false)
      return
    }

    const user = createUser(trimmedEmail, password)
    saveSession({ userId: user.id, email: user.email })
    router.replace('/dashboard')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-sage-100 p-8 space-y-5"
      noValidate
    >
      <h2 className="font-display text-2xl font-semibold text-sage-800">
        Create account
      </h2>

      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3"
        >
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-sage-700"
        >
          Email address
        </label>
        <input
          id="signup-email"
          data-testid="auth-signup-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-sage-200 rounded-xl px-4 py-3 text-sm text-sage-900 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium text-sage-700"
        >
          Password
        </label>
        <input
          id="signup-password"
          data-testid="auth-signup-password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-sage-200 rounded-xl px-4 py-3 text-sm text-sage-900 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition"
          placeholder="Choose a password"
        />
      </div>

      <button
        data-testid="auth-signup-submit"
        type="submit"
        disabled={busy}
        className="w-full bg-sage-600 hover:bg-sage-700 disabled:opacity-60 text-white font-medium rounded-xl py-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-800"
      >
        {busy ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
