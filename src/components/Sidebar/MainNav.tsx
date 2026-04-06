// src/components/Sidebar/MainNav.tsx
'use client'
import type { AppMenuItem } from '@src/types/types'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@ui/sidebar'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface MainNavProps {
  items: AppMenuItem[]
  userRole?: string
}

const SidebarMainNav = ({ items, userRole }: MainNavProps) => {
  const pathname = usePathname()
  const hasPermission = useCallback(
    (allowedRoles?: string[]) => {
      if (!allowedRoles) return true
      if (!userRole) return false
      return allowedRoles.includes(userRole)
    },
    [userRole],
  )

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (!hasPermission(item.roles)) return null

          if (item.isCollapsible && item.items) {
            return (
              <Collapsible
                key={item.title}
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.title}</span>
                      <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        if (!hasPermission(subItem.roles)) return null
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={subItem.href === pathname}
                            >
                              <Link href={subItem.href}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
              >
                <Link href={item.href ?? '#'}>
                  {item.icon && <item.icon className="size-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default SidebarMainNav
