'use client'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@src/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@src/components/ui/sidebar'
import Link from 'next/link'
import type { AppMenuItem } from '@src/lib/types'
import type { FC } from 'react'
import type { Session } from 'next-auth'
import { Role } from '@prisma/client'

interface MainNavProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SidebarGroup>, 'props'> {
  items: AppMenuItem[]
  session: Session | null
}

const SidebarMainNav: FC<MainNavProps> = ({ items, session, ...props }) => {
  return (
    <SidebarGroup {...props}>
      {/* <SidebarGroupLabel>App</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map(
          (item) =>
            item.roles?.includes(session?.user.role ?? Role.USER) && (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {!item.isCollapsible && item.href ? (
                    <Link href={item.href} prefetch>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}

                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  ) : (
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  )}

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map(
                        (subItem) =>
                          subItem.roles?.includes(
                            session?.user.role ?? Role.USER,
                          ) && (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.href} prefetch>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ),
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default SidebarMainNav
