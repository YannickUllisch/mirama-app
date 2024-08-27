'use client'
import React, { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
import { AlignLeft, ArrowLeft, FolderOpen } from 'lucide-react'

const AppHeader = () => {
  const pathname = usePathname()
  const router = useRouter()

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
      <div className="flex items-center justify-start gap-6">
        <ArrowLeft
          className="w-5 h-5 cursor-pointer md:block hidden hover:bg-hover rounded-md"
          onClick={() => router.back()}
        />
        <div className="text-hover">|</div>
        <Button variant="ghost" className="p-1 rounded-lg w-8 h-8 md:hidden ">
          <AlignLeft strokeWidth={1.3} className="transition-all" />
        </Button>

        {pathSegments.map((segment, index) => (
          <Breadcrumb key={segment} className="md:block hidden">
            <BreadcrumbList>
              {index < pathSegments.length - 1 ? (
                <>
                  <BreadcrumbItem>
                    <FolderOpen className="w-4 h-4" />
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
                    {capitalize(
                      segment.replace(/-/g, ' ').replace('app', 'Dashboard'),
                    )}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        ))}
      </div>
    </header>
  )
}

export default AppHeader
