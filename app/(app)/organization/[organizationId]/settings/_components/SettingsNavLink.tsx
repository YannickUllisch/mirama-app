// app/(app)/organization/[organizationId]/settings/_components/SettingsNavLink.tsx
'use client'
import { cn } from '@src/lib/utils'
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
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors',
        isActive
          ? 'bg-sidebar-accent text-ink font-medium'
          : 'text-ink/65 hover:bg-sidebar-accent hover:text-ink',
      )}
    >
      {icon}
      {label}
    </Link>
  )
}

export default SettingsNavLink
