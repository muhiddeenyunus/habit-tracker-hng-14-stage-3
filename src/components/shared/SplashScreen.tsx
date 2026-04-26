export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen bg-sage-600 flex flex-col items-center justify-center gap-4"
    >
      <div className="animate-pulse-soft flex flex-col items-center gap-3">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center text-4xl shadow-lg">
          🌿
        </div>
        <h1 className="font-display text-4xl font-bold text-white tracking-tight">
          Habit Tracker
        </h1>
        <p className="text-sage-100 text-sm font-body">
          Build streaks. Build yourself.
        </p>
      </div>

      {/* Loading indicator */}
      <div className="mt-8 flex gap-1.5" aria-label="Loading" role="status">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/50 animate-pulse-soft"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
