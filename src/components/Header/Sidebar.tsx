'use client'

import { useEffect, useState } from 'react'
import {
  Calendar,
  Folder,
  FolderOpen,
  FolderPen,
  GanttChartSquare,
  LayoutPanelTop,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import mirageLogoWhite from '@public/logo/mirage-logo-white.png'
import mirageLogoBlack from '@public/logo/mirage-logo-black.png'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import Image from 'next/image'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@src/components/ui/command'
import { useTheme } from 'next-themes'
import { Button } from '@src/components/ui/button'
import { useRouter } from 'next/navigation'

interface iMenuList {
  id: number
  href: string
  label: string
  icon: React.JSX.Element
}

const Sidebar = () => {
  const [logo, setLogo] = useState(mirageLogoWhite)

  const { theme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    if (theme === 'light') {
      setLogo(mirageLogoBlack)
    } else {
      setLogo(mirageLogoWhite)
    }
  }, [theme])

  const menuList: iMenuList[] = [
    {
      id: 1,
      href: '/overview',
      label: 'Overview',
      icon: <LayoutPanelTop strokeWidth={1.5} className="w-7 h-7" />,
    },
    {
      id: 2,
      href: '/all-projects',
      label: 'All Projects',
      icon: <FolderOpen strokeWidth={1.5} className="w-7 h-7" />,
    },
    {
      id: 3,
      href: '/my-projects',
      label: 'My Projects',
      icon: <Folder strokeWidth={1.5} className="w-7 h-7" />,
    },
    {
      id: 4,
      href: '/gantt',
      label: 'Gantt',
      icon: <GanttChartSquare strokeWidth={1.5} className="w-7 h-7" />,
    },
    // {
    //   id: 5,
    //   href: '/calendar',
    //   label: 'Calendar',
    //   icon: <Calendar strokeWidth={1.5} className="w-7 h-7" />,
    // },
    {
      id: 6,
      href: '/team',
      label: 'Team',
      icon: <Users strokeWidth={1.5} className="w-7 h-7" />,
    },
  ]

  return (
    <aside className="flex flex-col min-w-[300] shadow-sm h-screen bg-white dark:bg-neutral-950 rounded-2xl">
      <nav className="p-5 pb-2 flex justify-between items-center">
        <Link href={DEFAULT_LOGIN_REDIRECT}>
          <Image height={40} src={logo} alt={'Logo'} />
        </Link>
      </nav>
      <div className="flex-1 p-2">
        <Command style={{ overflow: 'visible' }}>
          <CommandList style={{ overflow: 'visible' }}>
            <CommandGroup heading={'General'}>
              {menuList.map((menu) => (
                // biome-ignore lint/a11y/useValidAnchor: <Find the right <type> for a link later>
                <a key={menu.id} onClick={() => router.push(menu.href)}>
                  <CommandItem
                    style={{ fontSize: 13 }}
                    className="flex gap-3 cursor-pointer relastive "
                  >
                    {menu.icon}
                    {menu.label}
                  </CommandItem>
                </a>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </aside>
  )
}

export default Sidebar
