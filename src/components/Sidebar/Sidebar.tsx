'use client'
import {
  Bell,
  Calculator,
  Calendar,
  ChevronsLeft,
  CircleHelp,
  Home,
  LayoutGrid,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { Command, CommandGroup, CommandList } from '@src/components/ui/command'
import { usePathname } from 'next/navigation'
import type { iMenuList } from '@src/lib/constants'
import SidebarItem from './SidebarItem'
import { useState } from 'react'
import { Button } from '../ui/button'
import GeneralTooltip from '../GeneralTooltip'

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
        {
          href: '/app/budget',
          label: 'Budgets',
          icon: <Calculator strokeWidth={1.2} className="w-6 h-7" />,
        },
      ],
    },
  ]

  return (
    <aside
      className={`${
        isCollapsed ? 'min-w-[60px]' : 'min-w-[200px]'
      } transition-all duration-300 ease-in-out relative hidden md:block  border-neutral-100 dark:border-neutral-800`}
    >
      <div
        className={`fixed flex flex-col ${
          isCollapsed ? 'w-[65px]' : 'w-[210px]'
        } h-full pb-5`}
      >
        <div className="flex justify-center relative">
          <Link href={'/'} className="p-3 flex gap-2">
            <span className="font-semibold" style={{ fontSize: 30 }}>
              {isCollapsed ? 'M.' : 'MIRAGE.'}
            </span>
          </Link>
        </div>

        <div className="p-2 flex-grow mt-0.5">
          <Command className="bg-transparent">
            <CommandList className="h-full">
              {menuList.map((group, index) => (
                <CommandGroup
                  key={`command-group-${group.group} ${index}`}
                  heading={!isCollapsed ? group.group : ''}
                >
                  {group.items.map((menu) => (
                    <div key={menu.label}>
                      {!isCollapsed ? (
                        <SidebarItem
                          key={menu.label}
                          currentPath={currPath}
                          item={menu}
                          isCollapsed={isCollapsed}
                        />
                      ) : (
                        <div className="flex flex-col z-20">
                          <GeneralTooltip
                            key={menu.label}
                            tipText={menu.label}
                            side="right"
                          >
                            <SidebarItem
                              currentPath={currPath}
                              item={menu}
                              isCollapsed={isCollapsed}
                            />
                          </GeneralTooltip>
                        </div>
                      )}
                    </div>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </div>
        <div className="flex items-start justify-start flex-col p-2 w-full">
          <Button
            variant={'ghost'}
            className={`${
              isCollapsed ? 'w-[50px]' : 'w-full'
            } gap-3 flex justify-start `}
          >
            <Bell className="w-5 h-5" />
            {!isCollapsed && <span>Notifications</span>}
          </Button>

          <Button
            variant={'ghost'}
            className={`${
              isCollapsed ? 'w-[50px]' : 'w-full'
            } gap-3 flex justify-start `}
          >
            <CircleHelp className="w-5 h-5" />
            {!isCollapsed && <span>Help</span>}
          </Button>

          <Button
            variant={'ghost'}
            onClick={() => setIsCollapsed((curr) => !curr)}
            className={`${
              isCollapsed ? 'w-[50px]' : 'w-full'
            } gap-3 flex justify-start `}
          >
            <ChevronsLeft
              className={`${
                isCollapsed ? 'rotate-180' : ''
              } transition ease-in-out duration-400 w-5 h-5`}
            />
            {!isCollapsed && <span>Collapse</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
