import { test, expect, type Page } from '@playwright/test'

// Helpers
async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

async function seedUser(
  page: Page,
  email    = 'test@example.com',
  password = 'password123'
) {
  await page.evaluate(
    ({ email, password }) => {
      const users = JSON.parse(localStorage.getItem('habit-tracker-users') ?? '[]')
      users.push({
        id:        'test-user-id',
        email,
        password,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('habit-tracker-users', JSON.stringify(users))
    },
    { email, password }
  )
}

async function seedSession(page: Page, email = 'test@example.com') {
  await page.evaluate((email) => {
    localStorage.setItem(
      'habit-tracker-session',
      JSON.stringify({ userId: 'test-user-id', email })
    )
  }, email)
}

async function seedHabit(page: Page, name: string, userId = 'test-user-id') {
  await page.evaluate(
    ({ name, userId }) => {
      const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') ?? '[]')
      habits.push({
        id:          `habit-${Date.now()}`,
        userId,
        name,
        description: '',
        frequency:   'daily',
        createdAt:   new Date().toISOString(),
        completions: [],
      })
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits))
    },
    { name, userId }
  )
}

// Tests
test.describe('Habit Tracker app', () => {

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/')
    // Splash screen must be visible immediately
    await expect(page.getByTestId('splash-screen')).toBeVisible()
    // Then redirects to /login within 2000ms
    await page.waitForURL('**/login', { timeout: 3000 })
    expect(page.url()).toContain('/login')
  })

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
    await seedUser(page)
    await seedSession(page)
    await page.goto('/')
    await page.waitForURL('**/dashboard', { timeout: 3000 })
    expect(page.url()).toContain('/dashboard')
  })

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
    await page.goto('/dashboard')
    await page.waitForURL('**/login', { timeout: 3000 })
    expect(page.url()).toContain('/login')
  })

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
    await page.goto('/signup')

    await page.getByTestId('auth-signup-email').fill('newuser@example.com')
    await page.getByTestId('auth-signup-password').fill('mypassword')
    await page.getByTestId('auth-signup-submit').click()

    await page.waitForURL('**/dashboard', { timeout: 5000 })
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
  })

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
    await seedUser(page, 'alice@example.com', 'alicepass')
    await seedHabit(page, 'Morning Run')
    // Seed a second user with a different habit
    await page.evaluate(() => {
      const users = JSON.parse(localStorage.getItem('habit-tracker-users') ?? '[]')
      users.push({ id: 'other-user', email: 'bob@example.com', password: 'bobpass', createdAt: new Date().toISOString() })
      localStorage.setItem('habit-tracker-users', JSON.stringify(users))
      const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') ?? '[]')
      habits.push({ id: 'bob-habit', userId: 'other-user', name: 'Evening Walk', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] })
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits))
    })

    await page.goto('/login')
    await page.getByTestId('auth-login-email').fill('alice@example.com')
    await page.getByTestId('auth-login-password').fill('alicepass')
    await page.getByTestId('auth-login-submit').click()

    await page.waitForURL('**/dashboard', { timeout: 5000 })
    await expect(page.getByTestId('habit-card-morning-run')).toBeVisible()
    await expect(page.getByTestId('habit-card-evening-walk')).not.toBeVisible()
  })

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
    await seedUser(page)
    await seedSession(page)
    await page.goto('/dashboard')

    await page.getByTestId('create-habit-button').click()
    await expect(page.getByTestId('habit-form')).toBeVisible()

    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-description-input').fill('8 glasses a day')
    await page.getByTestId('habit-save-button').click()

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
    await seedUser(page)
    await seedSession(page)
    await seedHabit(page, 'Drink Water')
    await page.goto('/dashboard')

    const streakEl = page.getByTestId('habit-streak-drink-water')
    await expect(streakEl).toContainText('0')

    await page.getByTestId('habit-complete-drink-water').click()

    await expect(streakEl).toContainText('1')
  })

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
    await seedUser(page)
    await seedSession(page)
    await seedHabit(page, 'Read Books')
    await page.goto('/dashboard')

    await expect(page.getByTestId('habit-card-read-books')).toBeVisible()

    // Reload the page
    await page.reload()

    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible()
  })

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
    await seedUser(page)
    await seedSession(page)
    await page.goto('/dashboard')

    await page.getByTestId('auth-logout-button').click()

    await page.waitForURL('**/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')

    // Session must be gone — going to dashboard redirects back to login
    await page.goto('/dashboard')
    await page.waitForURL('**/login', { timeout: 3000 })
  })

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    await page.goto('/')
    await clearStorage(page)
    await seedUser(page)
    await seedSession(page)

    // Load dashboard while online to prime the cache
    await page.goto('/dashboard')
    await expect(page.getByTestId('dashboard-page')).toBeVisible()

    // Go offline
    await context.setOffline(true)

    // Reload — app shell should still render from cache (no hard crash)
    await page.reload()

    // The page should not show a browser error screen
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).not.toContain('ERR_INTERNET_DISCONNECTED')
    expect(bodyText).not.toContain('No internet')

    await context.setOffline(false)
  })
})
