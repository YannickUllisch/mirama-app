'use client'
import React, { useEffect, useMemo, useState } from 'react'
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
import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import { LoadBarPulse } from '../Loading/LoadBarPulse'

const AppHeader = () => {
  const pathname = usePathname()
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [currentPath, setCurrentPath] = useState<string>(pathname)

  useEffect(() => {
    if (pathname !== currentPath && pageLoading) {
      setCurrentPath(pathname)
      setPageLoading(false)
    }
  }, [currentPath, pageLoading, pathname])

  const onRouteChange = () => {
    if (!pageLoading) {
      setPageLoading(true)
    }
  }

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
      {pageLoading && <LoadBarPulse />}
      <div className="flex items-center justify-start gap-4 pl-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 md:block hidden"
        />

        {pathSegments.map((segment, index) => (
          <Breadcrumb key={segment} className="md:block hidden">
            <BreadcrumbList>
              {index < pathSegments.length - 1 ? (
                <>
                  <BreadcrumbItem>
                    <Link
                      href={accumulatedPaths[index]}
                      passHref
                      onClick={onRouteChange}
                      onKeyUp={onRouteChange}
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
          <div className="flex gap-1 rounded-md px-2 items-center border border-hover">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search..."
              className="text-xs focus-visible:ring-0 flex-1 border-none focus:ring-0 shadow-none focus:outline-none bg-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
