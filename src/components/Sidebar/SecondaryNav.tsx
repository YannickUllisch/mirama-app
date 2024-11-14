import type { LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@src/components/ui/sidebar'
import Link from 'next/link'
import type { FC } from 'react'
import type { SecondaryAppMenuItem } from '@src/lib/constants'

interface SecondaryNavProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SidebarGroup>, 'props'> {
  items: SecondaryAppMenuItem[]
}

const SidebarSecondaryNav: FC<SecondaryNavProps> = ({ items, ...props }) => {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.menuAction}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default SidebarSecondaryNav
