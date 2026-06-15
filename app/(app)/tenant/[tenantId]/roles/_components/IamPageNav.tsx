// app/(app)/tenant/[tenantId]/roles/_components/IamPageNav.tsx
'use client'

import { cn } from '@src/lib/utils'
import { FileText, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Roles', icon: ShieldCheck, segment: 'roles' },
  { label: 'Policies', icon: FileText, segment: 'policies' },
] as const

export const IamPageNav = () => {
  const pathname = usePathname()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <div className="inline-flex items-center rounded-lg bg-muted p-1 h-9">
      {NAV_ITEMS.map(({ label, icon: Icon, segment }) => {
        const href = `/tenant/${tenantId}/${segment}`
        const isActive =
          segment === 'roles' ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={segment}
            href={href}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 h-7 text-xs font-medium transition-all',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        )
      })}
    </div>
  )
}
