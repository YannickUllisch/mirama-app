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
import { capitalize, isTeamAdminOrOwner } from '@src/lib/utils'
import Link from 'next/link'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import { LoadBarPulse } from '../Loading/LoadBarPulse'
import type { Session } from 'next-auth'
import AddProjectDialog from '../Dialogs/AddProjectDialog'
import { Button } from '../ui/button'

const AppHeader = ({ session }: { session: Session | null }) => {
  const pathname = usePathname()
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentPath, setCurrentPath] = useState<string>(pathname)

  // Sync currentPath with pathname after mount
  useEffect(() => {
    setCurrentPath(pathname)
    setIsMounted(true)
  }, [pathname])

  // Logic to handle loading bar on redirect through header
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

  // Guard rendering until component has mounted
  // Avoids rendering breadcrumbs before hydration
  if (!isMounted) {
    return null
  }

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
                      <span>
                        {capitalize(
                          segment
                            .replace(/-/g, ' ')
                            .replace('app', 'Dashboard'),
                        )}
                      </span>
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
      <div className="flex items-center gap-2 ">
        {session && isTeamAdminOrOwner(session) && (
          <div className="gap-2 flex">
            <AddProjectDialog
              key={'Project Dialog'}
              button={
                <Button className="p-3 text-xs" variant={'outline'}>
                  Add Project
                </Button>
              }
            />
          </div>
        )}
      </div>
    </header>
  )
}

export default AppHeader
