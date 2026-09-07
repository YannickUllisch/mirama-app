/**
 * An array of routes publicly accesible.
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  '/',
  '/contact',
  '/cookies',
  '/privacy',
  '/termsofservice',
  '/about',
  '/not-found',
  '/unauthorized',
]

/**
 * An array of routes used for authentication
 * These routes will redirect logged in users to /overview
 * @type {string[]}
 */
export const authRoutes: string[] = [
  '/auth/login',
  '/auth/register',
  '/auth/verify',
  '/auth/set-password',
  '/auth/forgot-password',
]

/**
 * Prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication and cannot be blocked.
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth'

/**
 * DEFAULT redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/home'

// Top-level path segments that can never be claimed as an organization slug -
// every static route below, plus '/home' and '/setup'. Organizations live at
// the root (/{slug}/...), so this is what keeps a slug like "about" or "setup"
// from shadowing the real route of the same name. Best-effort mirror of the
// backend's own reserved-slug check, which is the actual source of truth.
export const RESERVED_ORG_SLUGS: ReadonlySet<string> = new Set([
  ...publicRoutes.map((route) => route.replace(/^\//, '')).filter(Boolean),
  'auth',
  'api',
  'setup',
  'home',
])
