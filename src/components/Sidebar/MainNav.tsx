'use client'
import type { Role } from '@prisma/client'
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
import type { Session } from 'next-auth'
import Link from 'next/link'
import { useCallback } from 'react'

interface MainNavProps {
  items: AppMenuItem[]
  session: Session | null
  pathname: string
}

const SidebarMainNav = ({ items, session, pathname }: MainNavProps) => {
  const hasRole = useCallback(
    (roles: Role[]) => {
      if (!session?.user) return false
      return roles.includes(session.user.role as Role)
    },
    [session?.user],
  )
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (item.roles && !hasRole(item.roles)) return null

          if (item.isCollapsible && item.items) {
            return (
              <Collapsible key={item.title} defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="relative data-[active=true]:bg-transparent data-[active=true]:text-sidebar-foreground data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-0 data-[active=true]:before:bottom-0 data-[active=true]:before:w-1 data-[active=true]:before:bg-sidebar-primary data-[active=true]:before:rounded-r"
                    >
                      <item.icon className="size-4" strokeWidth={1.5} />
                      <span>{item.title}</span>
                      <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        if (subItem.roles && !hasRole(subItem.roles))
                          return null
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={`${subItem.href === pathname ? 'bg-transparent text-text font-semibold underline underline-offset-4' : ''}`}
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
                className="relative data-[active=true]:bg-transparent data-[active=true]:hover:bg-primary data-[active=true]:hover:text-sidebar-accent-foreground data-[active=true]:text-sidebar-foreground data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-0 data-[active=true]:before:bottom-0 data-[active=true]:before:w-1 data-[active=true]:before:bg-sidebar-primary data-[active=true]:before:rounded-r"
              >
                <Link href={item.href ?? '/app'}>
                  <item.icon className="size-4" strokeWidth={1.5} />
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
