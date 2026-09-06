import { auth } from '@auth'
import { getOrganizationMembership } from '@server/auth/helpers/queries'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'

export type ActiveOrganization = {
  organizationId: string
  organizationSlug: string
}

// Resolves the `[organizationSlug]` route segment to the organization's real Guid, verifying
// the current user is actually a member of it (GetOrgMembership on the backend). Wrapped in
// React.cache so every layout/page under [organizationSlug] that needs this within the same
// request shares one resolution instead of each re-hitting the backend.
//
// Note: this only resolves what the *page* should render with. It does not refresh the
// session/JWT itself - the org-switcher explicitly calls `update({ organizationSlug })` for
// that. Navigating straight to a different member organization's URL (bookmark, typed link)
// without going through the switcher will render that organization's shell correctly here,
// but Bearer-authenticated API calls elsewhere still carry whatever organization is on the
// current session token until it's refreshed - a pre-existing characteristic of how the
// session is scoped, not something introduced by slug-based routing.
export const resolveActiveOrganization = cache(
  async (slug: string): Promise<ActiveOrganization> => {
    const session = await auth()
    if (!session?.user?.id) {
      redirect('/auth/login')
    }

    // Common case: the URL already matches what the session was minted for - no extra
    // round trip needed.
    if (session.user.organizationSlug === slug && session.user.organizationId) {
      return {
        organizationId: session.user.organizationId,
        organizationSlug: session.user.organizationSlug,
      }
    }

    const membership = await getOrganizationMembership(session.user.id, slug)
    if (!membership) {
      notFound()
    }

    return {
      organizationId: membership.organizationId,
      organizationSlug: membership.organizationSlug,
    }
  },
)
