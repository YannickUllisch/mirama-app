'use client'
import {
  BadgeHelp,
  Bell,
  Calculator,
  Calendar,
  ChevronsLeft,
  CircleHelp,
  Coins,
  CreditCard,
  Home,
  LayoutGrid,
  Search,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@src/components/ui/command'
import { usePathname } from 'next/navigation'
import type { iMenuList } from '@src/lib/constants'
import SidebarItem from './SidebarItem'
import { useState } from 'react'
import HeaderProfile from '../Header/HeaderProfile'
import { useSession } from 'next-auth/react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

const Sidebar = () => {
  const currPath = usePathname()
  const { data: session } = useSession()

  const menuList: iMenuList[] = [
    {
      group: '',
      items: [
        {
          href: '/app',
          label: 'Dashboard',
          icon: <Home strokeWidth={1.2} className="w-6 h-7" />,
        },
        {
          href: '',
          label: 'My Work',
          icon: <LayoutGrid strokeWidth={1.2} className="w-6 h-7" />,
          subItems: [
            { href: '/app/projects', label: 'Projects' },
            { href: '/app/tasks', label: 'Tasks' },
            { href: '/app/archive', label: 'Archive' },
          ],
        },
        {
          href: '/app/calendar',
          label: 'Calendar',
          icon: <Calendar strokeWidth={1.2} className="w-6 h-7" />,
        },
      ],
    },
    {
      group: 'Management',
      items: [
        {
          href: '/app/team',
          label: 'Team',
          icon: <Users strokeWidth={1.2} className="w-6 h-7" />,
        },
        {
          href: '/app/budget',
          label: 'Budgets',
          icon: <Calculator strokeWidth={1.2} className="w-6 h-7" />,
        },
      ],
    },
  ]

  return (
    <aside className="fixed flex flex-col w-[210px] h-full">
      <div className="flex justify-evenly items-center relative">
        <Link href={'/'} className="p-3 flex gap-2 items-center justify-center">
          <span className="font-semibold" style={{ fontSize: 30 }}>
            MIRAGE.
          </span>
        </Link>
      </div>

      <div className="p-2 flex-grow mt-0.5">
        <Command className="bg-transparent">
          <CommandList className="h-full">
            {menuList.map((group) => (
              <CommandGroup key={group.group} heading={group.group}>
                {group.items.map((menu) => (
                  <SidebarItem
                    key={menu.label}
                    currentPath={currPath}
                    item={menu}
                    isCollapsed={false}
                  />
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </div>
      <div className="flex items-start justify-start flex-col p-2">
        <Button variant={'ghost'} className="gap-3 w-full flex justify-start">
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
        </Button>
        <Button variant={'ghost'} className="gap-3 w-full flex justify-start">
          <CircleHelp className="w-5 h-5" />
          <span>Help</span>
        </Button>
      </div>

      <div className="p-4">
        <Separator className="mb-4" />
        <HeaderProfile session={session} />
      </div>
    </aside>
  )
}

export default Sidebar
