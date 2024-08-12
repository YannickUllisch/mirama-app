'use client'
import React from 'react'
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
import { AlignLeft } from 'lucide-react'
import HeaderProfile from '@src/components/Header/HeaderProfile'

const AppHeader = () => {
  const pathname = usePathname()
  // We extract all segments from the URL for breadcrumbs.
  // We filter out specific segments with length = 25. This is the length of ID's, which we do not want to show up.
  const pathSegments: string[] = pathname
    .split('/')
    .filter((segment) => segment)
    .map((segment) => decodeURIComponent(segment))
    .filter((segment) => segment.length < 25)

  let accumulatedPath = ''

  return (
    <header className="flex gap-2 p-4 justify-between w-full bg-inherit border-b-2 dark:border-neutral-800 border-neutral-100">
      <div className="flex items-center justify-start gap-5">
        <Button variant="ghost" className="p-1 rounded-lg w-8 h-8">
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
                          <Link href={accumulatedPath} passHref legacyBehavior>
                            <BreadcrumbLink>
                              {capitalize(segment.replace(/-/g, ' '))}
                            </BreadcrumbLink>
                          </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbItem key={segment}>
                        <BreadcrumbPage>
                          {capitalize(segment.replace(/-/g, ' '))}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              )
            })
          : null}
      </div>

      <div className="flex items-center gap-4">
        <HeaderProfile />
      </div>
    </header>
  )
}

export default AppHeader
