import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-sage-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-sage-800 mb-2">
            Habit Tracker
          </h1>
          <p className="text-sage-600 text-sm">
            Sign in to continue your streak
          </p>
        </div>
        <LoginForm />
        <p className="text-center mt-6 text-sm text-sage-600">
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            className="text-sage-700 font-medium underline underline-offset-2 hover:text-sage-900 focus-visible:outline-sage-600"
          >
            Sign up
          </a>
        </p>
      </div>
    </main>
  )
}
