'use client'

import { SidebarMenu, SidebarMenuItem } from '@src/components/ui/sidebar'
import type { FavoriteEntityState } from '@src/modules/workspace/sidebar'
import { Building2 } from 'lucide-react'
import PmSidebarCollapsibleGroup from './PmSidebarCollapsibleGroup'
import PmSidebarMore from './PmSidebarMore'

const VISIBLE_LIMIT = 3

// User-curated pins - not customizable as a section (no visibility toggle, no context
// menu) and hidden entirely while empty, since there's no "add to favourites" UI yet.
// The section is still fully supported end-to-end in the sidebar's StateJson (see
// workspace/sidebar/sidebar.types.ts), so wiring up a "pin" action anywhere in the app later needs no
// further schema or API changes - it'll just start appearing here.
const PmFavoritesList = ({
  favorites,
}: {
  favorites: FavoriteEntityState[]
}) => {
  if (favorites.length === 0) return null

  const sorted = [...favorites].sort((a, b) => a.order - b.order)
  const shown = sorted.slice(0, VISIBLE_LIMIT)
  const overflow = sorted.slice(VISIBLE_LIMIT)

  return (
    <PmSidebarCollapsibleGroup label="Favourites">
      <SidebarMenu>
        {shown.map((favorite) => (
          <SidebarMenuItem
            key={`${favorite.type}-${favorite.entityId}`}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs text-body-text"
          >
            <Building2
              className="size-3.5 shrink-0"
              style={favorite.color ? { color: favorite.color } : undefined}
            />
            <span className="truncate">
              {favorite.label ?? favorite.entityId}
            </span>
          </SidebarMenuItem>
        ))}
        <PmSidebarMore
          items={overflow.map((favorite) => ({
            key: `${favorite.type}-${favorite.entityId}`,
            icon: (
              <Building2
                className="size-3.5 shrink-0"
                style={favorite.color ? { color: favorite.color } : undefined}
              />
            ),
            label: favorite.label ?? favorite.entityId,
          }))}
        />
      </SidebarMenu>
    </PmSidebarCollapsibleGroup>
  )
}

export default PmFavoritesList
