'use client'

import { SidebarMenuButton } from '@src/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ShellNavLinkProps {
  href: string
  label: string
  icon: React.ReactNode
}

const ShellNavLink = ({ href, label, icon }: ShellNavLinkProps) => {
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

export default ShellNavLink
