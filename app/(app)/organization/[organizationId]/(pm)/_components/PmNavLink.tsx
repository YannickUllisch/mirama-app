// app/(app)/organization/[organizationId]/(pm)/_components/PmNavLink.tsx
'use client'

import { SidebarMenuButton } from '@src/components/animate-ui/components/radix/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface PmNavLinkProps {
  href: string
  label: string
  icon: React.ReactNode
}

const PmNavLink = ({ href, label, icon }: PmNavLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={label}
      size="sm"
      className="text-body-text"
    >
      <Link href={href}>
        {icon}
        {label}
      </Link>
    </SidebarMenuButton>
  )
}

export default PmNavLink
