'use client'
import { Bell, ChevronsRight, CircleHelp } from 'lucide-react'
import Link from 'next/link'
import { Command, CommandGroup, CommandList } from '@src/components/ui/command'
import type { iMenuList } from '@src/lib/constants'
import SidebarItem from './SidebarItem'
import HeaderProfile from '../Header/HeaderProfile'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import type { Session } from 'next-auth'
import type { Dispatch, FC, SetStateAction } from 'react'
import GeneralTooltip from '../GeneralTooltip'

interface CollapsedSidebarProps {
  session: Session | null
  menuList: iMenuList[]
  setIsCollapsed: Dispatch<SetStateAction<boolean>>
  currentPathname: string
}

const CollapsedSidebar: FC<CollapsedSidebarProps> = ({
  session,
  menuList,
  setIsCollapsed,
  currentPathname,
}) => {
  return (
    <aside className="relative hidden md:block min-w-[50px] border-neutral-100 dark:border-neutral-800">
      <div className="fixed flex flex-col w-[60px] h-full justify-center place-content-between">
        <div className="flex justify-evenly items-center relative p-3">
          <Link href={'/'} className="flex gap-2 items-center justify-center">
            <span className="font-semibold" style={{ fontSize: 30 }}>
              M.
            </span>
          </Link>
        </div>

        <div className="flex-grow mt-0.5 items-center justify-center flex w-[60px]">
          <Command className="bg-transparent">
            <CommandList className="h-full">
              {menuList.map((group) => (
                <CommandGroup key={group.group}>
                  {group.items.map((menu) => (
                    <GeneralTooltip tipText={menu.label} side="right">
                      <SidebarItem
                        key={menu.label}
                        currentPath={currentPathname}
                        item={menu}
                        isCollapsed={true}
                      />
                    </GeneralTooltip>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </div>

        <div className="flex items-center w-full justify-center flex-col">
          <Button variant={'ghost'}>
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant={'ghost'}>
            <CircleHelp className="w-5 h-5" />
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => setIsCollapsed((curr) => !curr)}
          >
            <ChevronsRight />
          </Button>
        </div>

        <div className="p-2.5">
          <Separator className="mb-4" />

          <HeaderProfile session={session} onlyAvatar />
        </div>
      </div>
    </aside>
  )
}

export default CollapsedSidebar
