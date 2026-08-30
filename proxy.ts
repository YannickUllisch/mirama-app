import authConfig from '@server/auth/auth.config'
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from '@src/routes'
import NextAuth from 'next-auth'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return
  }

  // Redirect already-authenticated users away from login/register
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return
  }

  // Public routes are always accessible
  if (isPublicRoute) {
    return
  }

  // Everything below requires authentication
  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search)
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl.origin),
    )
  }

  const session = req.auth
  if (!session?.user) return

  // Organization guards -----------------
  const { organizationId } = session.user
  const pathname = nextUrl.pathname

  // Setup guard: only for users without an organization yet -----------------
  if (pathname.startsWith('/setup') && organizationId) {
    return Response.redirect(
      new URL(`/organization/${organizationId}`, nextUrl.origin),
    )
  }

  if (pathname.startsWith('/organization')) {
    if (!organizationId) {
      return Response.redirect(new URL('/setup', nextUrl.origin))
    }

    // Org route with a specific ID, verify it matches the session -
    // also covers the bare '/organization' entry point (no urlOrgId yet)
    const urlOrgId = pathname.split('/')[2]
    if (urlOrgId !== organizationId) {
      return Response.redirect(
        new URL(`/organization/${organizationId}`, nextUrl.origin),
      )
    }
  }

  return
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
