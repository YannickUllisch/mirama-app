// src/components/InnerSidebar.tsx
'use client'

import { cn } from '@src/lib/utils'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type InnerSidebarItem = {
  label: string
  href: string
  icon: LucideIcon
}

type InnerSidebarProps = {
  items: InnerSidebarItem[]
}

const InnerSidebar = ({ items }: InnerSidebarProps) => {
  const pathname = usePathname()

  return (
    <nav className="w-44 shrink-0 flex flex-col gap-0.5">
      {items.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors border-l-2',
              isActive
                ? 'bg-lava/10 text-ink font-medium border-l-lava'
                : 'text-muted-foreground hover:bg-surface-soft hover:text-ink border-l-transparent',
            )}
          >
            <Icon
              className={cn(
                'w-4 h-4 shrink-0',
                isActive ? 'text-lava' : 'text-muted-foreground',
              )}
            />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export default InnerSidebar
