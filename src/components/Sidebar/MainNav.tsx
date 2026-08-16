// src/components/Sidebar/MainNav.tsx
'use client'
import { cn } from '@src/lib/utils'
import type { AppMenuItem } from '@src/types/types'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavItemProps {
  item: AppMenuItem
}

const NavItem = ({ item }: NavItemProps) => {
  const pathname = usePathname()
  const isChildActive = item.items?.some((s) => s.href === pathname) ?? false
  const [open, setOpen] = useState(item.isActive || isChildActive)

  if (item.isCollapsible && item.items) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm overflow-hidden transition-colors group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0 group-data-[state=collapsed]:gap-0',
            isChildActive
              ? 'text-ink'
              : 'text-ink/65 hover:bg-sidebar-accent hover:text-ink',
          )}
        >
          <item.icon className="w-4 h-4 shrink-0 text-body-text" />
          <span className="flex-1 text-left whitespace-nowrap overflow-hidden group-data-[state=collapsed]:hidden">
            {item.title}
          </span>
          <ChevronRight
            className={cn(
              'w-3.5 h-3.5 text-body-text/40 transition-transform duration-200 group-data-[state=collapsed]:hidden',
              open && 'rotate-90',
            )}
          />
        </button>

        <div
          className={cn(
            'ml-[26px] space-y-0.5 overflow-hidden transition-[max-height,opacity,margin] duration-200 group-data-[state=collapsed]:max-h-0 group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:mt-0',
            open ? 'max-h-96 mt-0.5 opacity-100' : 'max-h-0 mt-0 opacity-0 pointer-events-none',
          )}
        >
          {item.items.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              className={cn(
                'flex items-center px-2.5 py-1.5 rounded-lg text-sm transition-colors',
                pathname === sub.href
                  ? 'bg-sidebar-accent text-ink font-medium'
                  : 'text-ink/60 hover:bg-sidebar-accent hover:text-ink',
              )}
            >
              {sub.title}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Link
      href={item.href ?? '#'}
      className={cn(
        'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm overflow-hidden transition-colors group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0 group-data-[state=collapsed]:gap-0',
        pathname === item.href
          ? 'bg-sidebar-accent text-ink font-medium'
          : 'text-ink/65 hover:bg-sidebar-accent hover:text-ink',
      )}
    >
      <item.icon className="w-4 h-4 shrink-0 text-body-text" />
      <span className="whitespace-nowrap group-data-[state=collapsed]:hidden">{item.title}</span>
    </Link>
  )
}

interface MainNavProps {
  items: AppMenuItem[]
  userRole?: string
}

const SidebarMainNav = ({ items, userRole }: MainNavProps) => {
  const hasPermission = (allowedRoles?: string[]) => {
    if (!allowedRoles) return true
    if (!userRole) return false
    return allowedRoles.includes(userRole)
  }

  const filtered = items.filter((item) => hasPermission(item.roles))

  const sections: { group: string | null; items: AppMenuItem[] }[] = []
  for (const item of filtered) {
    const g = item.group ?? null
    const last = sections[sections.length - 1]
    if (last && last.group === g) {
      last.items.push(item)
    } else {
      sections.push({ group: g, items: [item] })
    }
  }

  return (
    <div className="px-3 py-2 space-y-4 group-data-[state=collapsed]:space-y-1 group-data-[state=collapsed]:px-1">
      {sections.map(({ group, items: sItems }, i) => (
        <div key={group ?? i}>
          {group && (
            <p className="px-2.5 mb-1 text-[11px] font-medium text-body-text/55 uppercase tracking-[0.4px] overflow-hidden max-h-8 transition-[max-height,opacity,margin] duration-150 group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:max-h-0 group-data-[state=collapsed]:mb-0">
              {group}
            </p>
          )}
          <div className="space-y-0.5">
            {sItems.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SidebarMainNav
