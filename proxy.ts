import authConfig from '@server/auth/auth.config'
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  RESERVED_ORG_SLUGS,
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

  const { organizationSlug } = session.user
  const pathname = nextUrl.pathname
  const firstSegment = pathname.split('/')[1]

  // Organizations live at the root (/{slug}/...) - anything whose first
  // segment isn't one of the reserved static routes is an org-scoped route.
  if (!RESERVED_ORG_SLUGS.has(firstSegment)) {
    if (!organizationSlug) {
      return Response.redirect(new URL('/setup', nextUrl.origin))
    }

    // Org route with a specific slug, verify it matches the session
    if (firstSegment !== organizationSlug) {
      return Response.redirect(new URL(`/${organizationSlug}`, nextUrl.origin))
    }
    return
  }

  if (firstSegment === 'setup' && organizationSlug) {
    return Response.redirect(new URL(`/${organizationSlug}`, nextUrl.origin))
  }

  // Stable post-login landing spot that doesn't need to know the slug upfront
  if (firstSegment === 'home') {
    return Response.redirect(
      new URL(
        organizationSlug ? `/${organizationSlug}` : '/setup',
        nextUrl.origin,
      ),
    )
  }

  return
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
