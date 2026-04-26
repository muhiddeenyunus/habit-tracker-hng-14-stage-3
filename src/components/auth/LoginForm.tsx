'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { findUserByEmail, saveSession } from '@/lib/storage'

export default function LoginForm() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [busy,     setBusy]     = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)

    const user = findUserByEmail(email.trim())

    if (!user || user.password !== password) {
      setError('Invalid email or password')
      setBusy(false)
      return
    }

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
        Welcome back
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
          htmlFor="login-email"
          className="block text-sm font-medium text-sage-700"
        >
          Email address
        </label>
        <input
          id="login-email"
          data-testid="auth-login-email"
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
          htmlFor="login-password"
          className="block text-sm font-medium text-sage-700"
        >
          Password
        </label>
        <input
          id="login-password"
          data-testid="auth-login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-sage-200 rounded-xl px-4 py-3 text-sm text-sage-900 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition"
          placeholder="••••••••"
        />
      </div>

      <button
        data-testid="auth-login-submit"
        type="submit"
        disabled={busy}
        className="w-full bg-sage-600 hover:bg-sage-700 disabled:opacity-60 text-white font-medium rounded-xl py-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-800"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
