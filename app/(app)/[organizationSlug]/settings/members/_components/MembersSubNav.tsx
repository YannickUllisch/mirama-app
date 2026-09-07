'use client'

import OrgLink from '@src/components/OrgLink'
import { cn } from '@src/lib/utils'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { Building2, FolderKanban } from 'lucide-react'
import { usePathname } from 'next/navigation'

const MembersSubNav = () => {
  const pathname = usePathname()
  const { activeOrganizationSlug } = useOrganizationResource()
  const base = `/${activeOrganizationSlug}/settings/members`

  const tabs = [
    {
      label: 'Organization',
      href: '/settings/members',
      fullHref: base,
      icon: Building2,
    },
    {
      label: 'Projects',
      href: '/settings/members/projects',
      fullHref: `${base}/projects`,
      icon: FolderKanban,
    },
  ]

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-surface-soft p-1 mb-5">
      {tabs.map((tab) => {
        const isActive = pathname === tab.fullHref
        return (
          <OrgLink
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
          </OrgLink>
        )
      })}
    </div>
  )
}

export default MembersSubNav
