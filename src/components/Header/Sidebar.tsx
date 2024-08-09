'use client'
import { Archive, FolderOpen, Home, Leaf, Users } from 'lucide-react'
import Link from 'next/link'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@src/components/ui/command'
import { usePathname } from 'next/navigation'

interface iMenuList {
  group: string
  items: {
    id: number
    href: string
    label: string
    icon: React.JSX.Element
  }[]
}
const Sidebar = () => {
  const currPath = usePathname()

  const menuList: iMenuList[] = [
    {
      group: 'Projects',
      items: [
        {
          id: 1,
          href: '/app',
          label: 'Dashboard',
          icon: <Home strokeWidth={1.2} className="w-5 h-5" />,
        },
        {
          id: 2,
          href: '/app/management',
          label: 'Management',
          icon: <FolderOpen strokeWidth={1.2} className="w-5 h-5" />,
        },
        {
          id: 2,
          href: '/app/archive',
          label: 'Archive',
          icon: <Archive strokeWidth={1.2} className="w-5 h-5" />,
        },
      ],
    },
    {
      group: 'Management',
      items: [
        {
          id: 6,
          href: '/app/team',
          label: 'Team',
          icon: <Users strokeWidth={1.2} className="w-5 h-5" />,
        },
      ],
    },
  ]

  return (
    <aside className="flex flex-col min-w-[250px] h-screen bg-inherit border-r-2 border-neutral-100 dark:border-neutral-800">
      <div className="flex-1 flex flex-col">
        <Link href={'/'} className="ml-4 p-4 lg:ml-0 flex gap-2 items-center">
          <Leaf width={40} height={30} className="text-rose-500" />
          <span className="font-semibold" style={{ fontSize: 30 }}>
            MIRAMA
          </span>
        </Link>

        <div className="flex-1 p-2">
          <Command>
            <CommandList>
              {menuList.map((group) => (
                <CommandGroup key={group.group} heading={group.group}>
                  {group.items.map((menu) => (
                    <Link href={menu.href} key={menu.id}>
                      <CommandItem
                        style={{ fontSize: 13 }}
                        className={`flex gap-3 cursor-pointer relative hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
                          menu.href === currPath
                            ? 'bg-neutral-100 dark:bg-neutral-800'
                            : ''
                        }`}
                      >
                        {menu.icon}
                        {menu.label}
                      </CommandItem>
                    </Link>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
