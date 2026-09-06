'use client'

import { cn } from '@src/lib/utils'
import { Building2, FolderKanban } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

const MembersSubNav = () => {
  const pathname = usePathname()
  const { organizationSlug } = useParams<{ organizationSlug: string }>()
  const base = `/organization/${organizationSlug}/settings/members`

  const tabs = [
    { label: 'Organization', href: base, icon: Building2 },
    { label: 'Projects', href: `${base}/projects`, icon: FolderKanban },
  ]

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-surface-soft p-1 mb-5">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-canvas text-ink shadow-sm'
                : 'text-body-text hover:text-ink',
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}

export default MembersSubNav
