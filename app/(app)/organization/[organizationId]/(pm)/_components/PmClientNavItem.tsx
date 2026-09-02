'use client'

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@src/components/animate-ui/components/radix/sidebar'
import { cn } from '@src/lib/utils'
import {
  Building2,
  ChevronRight,
  Home,
  Layers2Icon,
  SquareCheckBigIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { PmClient } from './PmClientsServer'

const PmClientNavItem = ({
  client,
  organizationId,
}: {
  client: PmClient
  organizationId: string
}) => {
  const pathname = usePathname()
  const base = `/organization/${organizationId}/clients/${client.slug}`
  const isChildActive = pathname.startsWith(base)
  const [open, setOpen] = useState(isChildActive)

  const subItems = [
    { label: 'Home', href: base, icon: Home },
    { label: 'Issues', href: `${base}/issues`, icon: SquareCheckBigIcon },
    { label: 'Projects', href: `${base}/projects`, icon: Layers2Icon },
  ]

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setOpen((v) => !v)}
        size="sm"
        className="text-body-text"
      >
        <Building2 className="w-3.5 h-3.5 shrink-0" />
        <span className="flex-1 truncate text-left">{client.name}</span>
        <ChevronRight
          className={cn(
            'size-3 shrink-0 text-body-text/40 transition-transform duration-200',
            open && 'rotate-90',
          )}
        />
      </SidebarMenuButton>

      {open && (
        <SidebarMenuSub>
          {subItems.map((item) => (
            <SidebarMenuSubItem key={item.href}>
              <SidebarMenuSubButton
                asChild
                size="sm"
                isActive={pathname === item.href}
              >
                <Link href={item.href}>
                  <item.icon className="w-3 h-3 shrink-0" />
                  {item.label}
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  )
}

export default PmClientNavItem
