// src/components/Header/HeaderBreadcrumbs.tsx
'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@src/components/ui/breadcrumb'
import { capitalize } from '@src/lib/utils'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'
import HoverLink from '../HoverLink'

const HeaderBreadcrumbs = () => {
  const pathname = usePathname()

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
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList className="gap-1">
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1
          const label = capitalize(
            segment.replace(/-/g, ' ').replace('app', 'Dashboard'),
          )

          return (
            <React.Fragment key={segment}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-[10px] font-black tracking-widest text-neutral-900 dark:text-neutral-100">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <HoverLink
                    href={accumulatedPaths[index]}
                    className="text-[10px] font-bold tracking-widest text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    {label}
                  </HoverLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="text-neutral-200 dark:text-neutral-800 scale-75" />
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default HeaderBreadcrumbs
