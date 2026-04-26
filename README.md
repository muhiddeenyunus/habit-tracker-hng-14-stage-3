# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits and building streaks.
Built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

---

## Live URL & Repository

| | |
|---|---|
| **Live URL** | https://your-deployment.vercel.app |
| **Stack** | Next.js 14, React 18, TypeScript, Tailwind CSS, localStorage, Vitest, Playwright |

---

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm 9+

### Install

```bash
git clone https://github.com/your-username/habit-tracker.git
cd habit-tracker
npm install
```

### Run the app

```bash
# Development server
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm run start
```

---

## Test Instructions

### Run all tests

```bash
npm test
```

### Unit tests only (with coverage)

```bash
npm run test:unit
```

Coverage is generated for `src/lib/**` with a minimum threshold of 80% line coverage.
The HTML report is written to `coverage/index.html`.

### Integration / component tests

```bash
npm run test:integration
```

### End-to-end tests (Playwright)

```bash
# Requires the dev server running first:
npm run dev

# In a second terminal:
npm run test:e2e
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx            Root layout; registers SW; PWA metadata
│   ├── page.tsx              / route: splash screen + session check + redirect
│   ├── login/page.tsx        /login route
│   ├── signup/page.tsx       /signup route
│   └── dashboard/page.tsx    /dashboard route (protected)
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx     Login form with required data-testid selectors
│   │   └── SignupForm.tsx    Signup form with required data-testid selectors
│   ├── habits/
│   │   ├── HabitCard.tsx     Per-habit card with slug-based test IDs
│   │   └── HabitForm.tsx     Create/edit habit form
│   └── shared/
│       ├── SplashScreen.tsx          data-testid="splash-screen"
│       └── ServiceWorkerRegister.tsx Client-side SW registration
│
├── lib/
│   ├── slug.ts       getHabitSlug()
│   ├── validators.ts validateHabitName()
│   ├── streaks.ts    calculateCurrentStreak()
│   ├── habits.ts     toggleHabitCompletion()
│   └── storage.ts    All localStorage read/write helpers
│
└── types/
    ├── auth.ts        User, Session
    └── habit.ts       Habit

tests/
├── unit/
│   ├── slug.test.ts
│   ├── validators.test.ts
│   ├── streaks.test.ts
│   └── habits.test.ts
├── integration/
│   ├── auth-flow.test.tsx
│   └── habit-form.test.tsx
├── e2e/
│   └── app.spec.ts
└── setup.ts

public/
├── manifest.json
├── sw.js
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## Local Persistence Structure

All state is stored in `localStorage` using three fixed keys defined in `src/lib/storage.ts`:

### `habit-tracker-users`
JSON array of registered users:
```json
[{ "id": "uuid", "email": "user@example.com", "password": "plaintext", "createdAt": "ISO string" }]
```

### `habit-tracker-session`
Either `null` or the active session object:
```json
{ "userId": "uuid", "email": "user@example.com" }
```

### `habit-tracker-habits`
JSON array of all habits across all users, filtered by `userId` at read time:
```json
[{
  "id": "uuid", "userId": "uuid", "name": "Drink Water",
  "description": "8 glasses", "frequency": "daily",
  "createdAt": "ISO string", "completions": ["2024-06-14", "2024-06-15"]
}]
```

Completions are ISO calendar dates (`YYYY-MM-DD`), always deduplicated before storage.

---

## PWA Implementation

### Manifest (`public/manifest.json`)
Declares `name`, `short_name`, `start_url: "/"`, `display: "standalone"`, `theme_color`, `background_color`, and icons at 192px and 512px. Linked from `<head>` in `layout.tsx`.

### Service Worker (`public/sw.js`)
Registered client-side via `ServiceWorkerRegister.tsx` (rendered in root layout).

**Caching strategy:**
- **Install**: pre-caches app shell routes (`/`, `/login`, `/signup`, `/dashboard`, `/manifest.json`)
- **Activate**: deletes stale caches from previous SW versions
- **Fetch**: cache-first with background revalidation; falls back to cached `/` for document requests when offline — preventing a hard crash

After the app is loaded once while online, the app shell renders correctly offline.

---

## Trade-offs and Limitations

| Decision | Reason | Limitation |
|---|---|---|
| `localStorage` only | Spec-required; deterministic | ~5MB limit; not shared across devices |
| Plaintext passwords | Local-only per spec; no auth service | Not safe for production |
| Client-side route guard | No Next.js middleware needed | Dashboard briefly mounts before redirect when session absent |
| `daily` frequency only | Spec requires only daily for Stage 3 | Weekly/custom frequencies not implemented |

---

## Test File Map

| Test file | Describe block | What it verifies |
|---|---|---|
| `tests/unit/slug.test.ts` | `getHabitSlug` | Lowercase, hyphenation, trimming, special-char removal |
| `tests/unit/validators.test.ts` | `validateHabitName` | Empty rejection, 60-char limit, trimmed valid output |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` | Empty array, today not completed, consecutive days, duplicates, gap breaks streak |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` | Add date, remove date, no mutation, no duplicates |
| `tests/integration/auth-flow.test.tsx` | `auth flow` | Signup creates session, duplicate email error, login stores session, wrong-password error |
| `tests/integration/habit-form.test.tsx` | `habit form` | Validation error, create habit, edit preserves immutable fields, delete requires confirmation, toggle updates streak |
| `tests/e2e/app.spec.ts` | `Habit Tracker app` | Splash redirect, auth guard, signup, login user isolation, create habit, complete + streak, persist on reload, logout, offline app shell |

---

## Accessibility

- Semantic HTML: `<main>`, `<header>`, `<form>`, `<label>`, `<button>`
- All inputs have visible `<label>` elements linked via `htmlFor`
- All interactive elements are native `<button>` elements
- `aria-pressed` on completion toggle
- `aria-label` on icon-only buttons
- `aria-invalid` and `aria-describedby` on inputs with errors
- `role="alert"` on error messages
- Visible `:focus-visible` outlines on all interactive elements
- Usable at 320px minimum viewport width
