import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-sage-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-sage-800 mb-2">
            Habit Tracker
          </h1>
          <p className="text-sage-600 text-sm">
            Create an account to start tracking
          </p>
        </div>
        <SignupForm />
        <p className="text-center mt-6 text-sm text-sage-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-sage-700 font-medium underline underline-offset-2 hover:text-sage-900"
          >
            Sign in
          </a>
        </p>
      </div>
    </main>
  )
}
