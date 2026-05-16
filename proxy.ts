import authConfig from '@server/auth/auth.config'
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  onboardingRoutes,
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
  const isOnboardingPage = onboardingRoutes.includes(nextUrl.pathname)

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

  // Onboarding Guards -----------------
  const isNotOnboarded = session.user.isOnboarded === false

  if (isNotOnboarded && !isOnboardingPage) {
    // Kick user to onboarding if they try accessing protected areas
    return Response.redirect(new URL('/portal/onboarding', nextUrl.origin))
  }

  if (!isNotOnboarded && isOnboardingPage) {
    // Prevent onboarded users from lingering on the onboarding view
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  }

  // If they are not onboarded, stop them from hitting deeper tenant/org guards
  if (isNotOnboarded && isOnboardingPage) {
    return
  }

  // Tenant Guards -----------------
  const { tenantId, organizationId } = session.user
  const pathname = nextUrl.pathname
  if (pathname.startsWith('/tenant/')) {
    const urlTenantId = pathname.split('/')[2]
    if (urlTenantId && urlTenantId !== tenantId) {
      return Response.redirect(new URL(`/tenant/${tenantId}`, nextUrl.origin))
    }
  }

  // Organization guards -----------------
  if (pathname.startsWith('/organization')) {
    if (!organizationId) {
      return Response.redirect(new URL(`/portal`, nextUrl.origin))
    }

    // Org route with a specific ID, verify it matches the session
    const urlOrgId = pathname.split('/')[2]
    if (urlOrgId && urlOrgId !== organizationId) {
      return Response.redirect(new URL(`/portal`, nextUrl.origin))
    }
  }

  return
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
