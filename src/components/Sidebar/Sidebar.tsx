'use client'
import {
  Calendar,
  ChevronsLeft,
  ChevronsUpDown,
  Home,
  LayoutGrid,
  Leaf,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { Command, CommandGroup, CommandList } from '@src/components/ui/command'
import { usePathname } from 'next/navigation'
import type { iMenuList } from '@src/lib/constants'
import SidebarItem from './SidebarItem'
import { useState } from 'react'

const Sidebar = () => {
  const currPath = usePathname()
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

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
      ],
    },
  ]

  return (
    <aside className="fixed flex flex-col w-[210px] min-h-screen">
      <div className="flex justify-evenly items-center relative">
        <Link href={'/'} className="p-4 flex gap-2 items-center justify-center">
          <span className="font-semibold" style={{ fontSize: 25.4 }}>
            MIRAGE.
          </span>
        </Link>
      </div>

      <div className="grow overflow-hidden p-2 border-t-2 border-neutral-100 dark:border-neutral-800 mt-0.5">
        <Command>
          <CommandList>
            {menuList.map((group) => (
              <CommandGroup
                key={group.group}
                heading={!isCollapsed ? group.group : ''}
              >
                {group.items.map((menu) => (
                  <SidebarItem
                    key={menu.label}
                    currentPath={currPath}
                    item={menu}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </div>

      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        onKeyDown={() => setIsCollapsed(!isCollapsed)}
        className="flex p-3 gap-3 cursor-pointer justify-center hover:bg-neutral-50 dark:hover:bg-neutral-900"
      >
        <ChevronsLeft width={30} />
      </div>
    </aside>
  )
}

export default Sidebar
