'use client'
import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@src/components/ui/breadcrumb'
import { capitalize, isTeamAdminOrOwner } from '@src/lib/utils'
import Link from 'next/link'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import type { Session } from 'next-auth'
import AddProjectDialog from '../Dialogs/AddProjectDialog'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

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
    <header
      style={{ zIndex: 5 }}
      className="sticky top-0 w-full flex gap-2 border-b-2 p-4 justify-between bg-inherit dark:border-neutral-800/40 border-neutral-100/60"
    >
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
                    <Link href={accumulatedPaths[index]} passHref>
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
      <div className="flex items-center gap-2">
        {session && isTeamAdminOrOwner(session) && (
          <div className="gap-1 flex">
            <AddProjectDialog
              key={'Project Dialog'}
              button={
                <Button className="p-3 text-xs" variant={'outline'}>
                  <div className="flex gap-2 items-center">
                    <Plus className="w-3" />
                    Project
                  </div>
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
