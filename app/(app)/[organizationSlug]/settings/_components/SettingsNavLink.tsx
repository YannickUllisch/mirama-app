'use client'

import { SidebarMenuButton } from '@src/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SettingsNavLinkProps {
  href: string
  label: string
  icon: React.ReactNode
}

const SettingsNavLink = ({ href, label, icon }: SettingsNavLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <SidebarMenuButton asChild isActive={isActive} className="text-body-text">
      <Link href={href}>
        {icon}
        {label}
      </Link>
    </SidebarMenuButton>
  )
}

export default SettingsNavLink
