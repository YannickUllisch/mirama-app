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
export const DEFAULT_LOGIN_REDIRECT: string = '/organization'
