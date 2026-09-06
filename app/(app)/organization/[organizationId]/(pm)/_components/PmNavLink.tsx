'use client'

import { SidebarMenuButton } from '@src/components/ui/sidebar'
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
