'use client'
import { useTheme } from 'next-themes'
import React, { useEffect, useState, type FC } from 'react'
import { Button } from '@src/components/ui/button'
import { AlignLeft, Bell, Moon, Search, Sun } from 'lucide-react'
import ProfileButton from '@/src/components/Dialogs/ProfileButton'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '../ui/breadcrumb'
import { capitalize } from '@/src/lib/utils'

interface HeaderProps {
  toggleSidebar: () => void
}

const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
  const pathname = usePathname()
  const pathSegments: string[] = pathname
    .split('/')
    .filter((segment) => segment)
    .map((segment) => decodeURIComponent(segment))
  let accumulatedPath = ''

  return (
    <header className="flex gap-2 p-4 justify-between w-full bg-inherit border-b-2 dark:border-neutral-800 border-neutral-100">
      <div className="flex items-center justify-start gap-5">
        <Button
          variant="ghost"
          className="p-1 rounded-lg w-8 h-8"
          onClick={toggleSidebar}
        >
          <AlignLeft strokeWidth={1.3} className="transition-all" />
        </Button>

        {pathSegments
          ? pathSegments.map((segment, index) => {
              accumulatedPath += `/${segment}`
              return (
                <Breadcrumb key={segment}>
                  <BreadcrumbList>
                    {index < pathSegments.length - 1 ? (
                      <>
                        <BreadcrumbItem key={segment}>
                          <BreadcrumbLink href={accumulatedPath}>
                            {capitalize(segment)}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbItem key={segment}>
                        <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
                      </BreadcrumbItem>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              )
            })
          : null}
      </div>

      <div className="flex items-center gap-4">
        <Button variant={'ghost'} size={'icon'} aria-label="Notifications">
          <Bell strokeWidth={1.5} className="h-4 w-4" />
        </Button>
        <ProfileButton />
      </div>
    </header>
  )
}

export default Header
