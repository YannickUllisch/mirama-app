import { auth } from '@auth'
import {
  parseSidebarState,
  type SidebarState,
} from '@src/modules/workspace/sidebar'
import { fetchSidebarBootstrapServer } from '@src/modules/workspace/viewstate.server'
import ShellSidebar from './ShellSidebar'

// The one server-side data fetch behind the whole sidebar: personalization state (saved,
// or the backend's computed default) plus the org's live client list, in a single request.
// Rendered as an async leaf component (not awaited-then-passed-down from a parent) so it
// resolves concurrently with sibling parts of the layout tree rather than blocking them.
const EMPTY_SIDEBAR_STATE: SidebarState = {
  items: [],
  groups: [],
  favorites: { items: [] },
}

// organizationId (the real Guid) is only needed here, for the backend data fetch below -
// everything rendered from this point down only ever builds hrefs, so it's handed
// organizationSlug instead (the URL segment).
const ShellSidebarServer = async ({
  organizationId,
  organizationSlug,
}: {
  organizationId: string
  organizationSlug: string
}) => {
  const session = await auth()
  if (!session?.user?.memberId) return null

  // Defensive: a transient backend/auth hiccup here should degrade to the static manifest
  // (nothing personalized, no clients) rather than take down the whole app shell.
  let sidebarState: SidebarState = EMPTY_SIDEBAR_STATE
  let clients: Awaited<
    ReturnType<typeof fetchSidebarBootstrapServer>
  >['clients'] = []

  try {
    const bootstrap = await fetchSidebarBootstrapServer(organizationId)
    sidebarState =
      parseSidebarState(bootstrap.sidebar.stateJson) ?? EMPTY_SIDEBAR_STATE
    clients = bootstrap.clients
  } catch {
    // Fall through with the empty defaults set above.
  }

  return (
    <ShellSidebar
      organizationSlug={organizationSlug}
      sidebarState={sidebarState}
      clients={clients}
    />
  )
}

export default ShellSidebarServer
