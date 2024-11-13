'use client'
import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@src/components/ui/breadcrumb'
import { capitalize } from '@src/lib/utils'
import Link from 'next/link'
import { Button } from '@src/components/ui/button'
import { AlignJustify, FolderOpen, Home, Search } from 'lucide-react'
import HeaderProfile from './HeaderProfile'
import type { Session } from 'next-auth'
import { Input } from '../ui/input'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'

const AppHeader = ({ session }: { session: Session | null }) => {
  const pathname = usePathname()

  // We extract all segments from the URL for breadcrumbs.
  // We filter out specific segments with length = 25. This is the length of ID's, which we do not want to show up.
  const { pathSegments, accumulatedPaths } = useMemo(() => {
    if (!pathname) return { pathSegments: [], accumulatedPaths: [] }

    const segments = pathname
      .split('/')
      .filter((segment) => segment && segment.length < 25)
      .map((segment) => decodeURIComponent(segment))

    const paths = segments.map(
      (_, index) => `/${segments.slice(0, index + 1).join('/')}`,
    )

    return { pathSegments: segments, accumulatedPaths: paths }
  }, [pathname])

  return (
    <header className="flex gap-2 p-4 justify-between w-full bg-inherit dark:border-neutral-800 border-neutral-100">
      <div className="flex items-center justify-start gap-4 pl-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Button variant="ghost" className="p-1 rounded-lg w-8 h-8 md:hidden ">
          <AlignJustify strokeWidth={1.3} className="transition-all" />
        </Button>

        {pathSegments.map((segment, index) => (
          <Breadcrumb key={segment} className="md:block hidden">
            <BreadcrumbList>
              {index < pathSegments.length - 1 ? (
                <>
                  <BreadcrumbItem>
                    {segment === 'app' ? (
                      <Home className="w-4 h-4" />
                    ) : (
                      <FolderOpen className="w-4 h-4" />
                    )}

                    <Link
                      href={accumulatedPaths[index]}
                      passHref
                      legacyBehavior
                    >
                      <BreadcrumbLink>
                        {capitalize(
                          segment
                            .replace(/-/g, ' ')
                            .replace('app', 'Dashboard'),
                        )}
                      </BreadcrumbLink>
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <div className="flex gap-2 items-center">
                      {segment === 'app' ? <Home className="w-4 h-4 " /> : null}
                      {capitalize(
                        segment.replace(/-/g, ' ').replace('app', 'Dashboard'),
                      )}
                    </div>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        ))}
      </div>
      <div className="justify-evenly items-center block md:hidden">
        <Link href={'/app'} className="flex gap-2 items-center justify-center">
          <span className="font-semibold" style={{ fontSize: 30 }}>
            MIRAGE.
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="md:block hidden">
          <div className="flex gap-1 rounded-md px-2 py-1 items-center border border-hover">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search..."
              className="focus-visible:ring-0 flex-1 border-none focus:ring-0 shadow-none focus:outline-none bg-transparent"
            />
          </div>
        </div>

        <HeaderProfile session={session} onlyAvatar />
      </div>
    </header>
  )
}

export default AppHeader
