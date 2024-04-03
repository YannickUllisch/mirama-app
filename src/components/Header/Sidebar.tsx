'use client'

import { useEffect, useState } from 'react'
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  BriefcaseBusiness,
  Calendar,
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
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@src/components/ui/hover-card'
import { Button } from '@src/components/ui/button'
import { useRouter } from 'next/navigation'

interface iMenuList {
  id: number
  href: string
  label: string
  icon: React.JSX.Element
}

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true)
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
      icon: <LayoutPanelTop className="w-7 h-7" />,
    },
    {
      id: 2,
      href: '/overview',
      label: 'Projects',
      icon: <BriefcaseBusiness className="w-7 h-7" />,
    },
    {
      id: 3,
      href: '/gantt',
      label: 'Gantt',
      icon: <GanttChartSquare className="w-7 h-7" />,
    },
    {
      id: 4,
      href: '/overview',
      label: 'Calendar',
      icon: <Calendar className="w-7 h-7" />,
    },
    {
      id: 5,
      href: '/team',
      label: 'Team',
      icon: <Users className="w-7 h-7" />,
    },
  ]

  return (
    <aside className="flex flex-col min-w-[300] border-r min-h-screen dark:border-neutral-800">
      <nav className="p-3 pb-2 m-2 flex justify-between items-center">
        <div className="justify-start flex">
          {expanded ? (
            <Link href={DEFAULT_LOGIN_REDIRECT}>
              <Image height={40} src={logo} alt={'Logo'} />
            </Link>
          ) : null}
        </div>
        <div className={` flex ${expanded ? 'ml-10 justify-end' : 'mr-4'}`}>
          <Button
            variant="ghost"
            className="p-1 rounded-lg w-8 h-8"
            onClick={() => setExpanded((curr) => !curr)}
          >
            {expanded ? (
              <ArrowLeftToLine className='rotate-0 scale-100 transition-all"' />
            ) : (
              <ArrowRightToLine />
            )}
          </Button>
        </div>
      </nav>
      <div className="flex-1 p-2">
        <Command style={{ overflow: 'visible' }}>
          <CommandSeparator />
          <CommandList style={{ overflow: 'visible' }}>
            <CommandGroup
              heading={expanded ? 'General' : 'General'}
              className="ml-0"
            >
              {menuList.map((menu) => (
                // biome-ignore lint/a11y/useValidAnchor: <explanation>
                <a key={menu.id} onClick={() => router.push(menu.href)}>
                  <CommandItem
                    style={{ fontSize: 13 }}
                    className="flex gap-3 cursor-pointer relastive"
                  >
                    {menu.icon}
                    {expanded ? menu.label : ''}
                  </CommandItem>
                </a>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </div>
    </aside>
  )
}

export default Sidebar
