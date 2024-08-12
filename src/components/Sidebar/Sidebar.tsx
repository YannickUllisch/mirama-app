'use client'
import {
  Archive,
  Calendar,
  ChevronsLeft,
  ChevronsUpDown,
  Home,
  LayoutGrid,
  Leaf,
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
import { Button } from '../ui/button'

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
          label: 'All Projects',
          icon: <LayoutGrid strokeWidth={1.2} className="w-6 h-7" />,
          subItems: [
            { href: '/app/projects', label: 'Projects' },
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
      <div className="flex justify-start items-center relative">
        <Link href={'/'} className="p-4 flex gap-2 items-center">
          <Leaf width={37} height={37} className="text-rose-500" />
          <span className="font-semibold" style={{ fontSize: 25.4 }}>
            MIRAMA
          </span>
        </Link>
        {/* <ChevronsUpDown strokeWidth={2} width={15} className="cursor-pointer" /> */}
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
