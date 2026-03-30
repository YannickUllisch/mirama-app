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

  // Session is guaranteed to exist after the auth check above
  const session = req.auth
  if (!session?.user) return

  const { tenantId, organizationId } = session.user
  const pathname = nextUrl.pathname
  if (pathname.startsWith('/tenant/')) {
    const urlTenantId = pathname.split('/')[2]
    if (urlTenantId && urlTenantId !== tenantId) {
      return Response.redirect(new URL(`/tenant/${tenantId}`, nextUrl.origin))
    }
  }

  // 6. Organization route guard
  if (pathname.startsWith('/organization')) {
    // No org context in session → redirect to tenant dashboard
    if (!organizationId) {
      return Response.redirect(new URL(`/tenant/${tenantId}`, nextUrl.origin))
    }

    // Org route with a specific ID, verify it matches the session
    const urlOrgId = pathname.split('/')[2]
    if (urlOrgId && urlOrgId !== organizationId) {
      return Response.redirect(new URL(`/tenant/${tenantId}`, nextUrl.origin))
    }
  }

  // 7. API route guard: reject mismatched tenant/org IDs with 403
  if (pathname.startsWith('/api/db/')) {
    const segments = pathname.split('/')
    // /api/db/tenant/:tenantId/...
    if (segments[3] === 'tenant') {
      const urlTenantId = segments[4]
      if (urlTenantId && urlTenantId !== tenantId) {
        return Response.json({ message: 'Forbidden' }, { status: 403 })
      }
    }
    // /api/db/organization/:organizationId/...
    if (segments[3] === 'organization') {
      const urlOrgId = segments[4]
      if (!organizationId || (urlOrgId && urlOrgId !== organizationId)) {
        return Response.json({ message: 'Forbidden' }, { status: 403 })
      }
    }
  }

  return
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
