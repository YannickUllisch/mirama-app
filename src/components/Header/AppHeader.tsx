'use client'

import apiRequest from '@hooks/query'
import { FavouriteType } from '@prisma/client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@src/components/ui/breadcrumb'
import { capitalize, cn } from '@src/lib/utils'
import { Input } from '@ui/input'
import { Command, Search, Star } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'
import HoverLink from '../HoverLink'
import MiramaIcon from '../MiramaIcon'
import { Button } from '../ui/button'
import { SidebarTrigger } from '../ui/sidebar'
import HeaderProfile from './HeaderProfile'

const AppHeader = () => {
  const pathname = usePathname()
  const { data: session } = useSession()

  const { data: favs } = apiRequest.favourite.fetchByType.useQuery(
    FavouriteType.ROUTE,
  )
  const createFavMutation = apiRequest.favourite.create.useMutation()
  const deleteFavMutation = apiRequest.favourite.delete.useMutation()

  const currFav = useMemo(() => {
    return favs?.find((fav) => fav.data === pathname)
  }, [favs, pathname])

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

  const handleToggleFav = () => {
    if (!currFav) {
      createFavMutation.mutate({
        type: FavouriteType.ROUTE,
        data: pathname,
      })
    } else {
      deleteFavMutation.mutate(currFav.id)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background border-b border-neutral-100 dark:border-neutral-900">
      <div className="flex h-14 items-center gap-4 px-4 justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" />

          <HoverLink href="/" className="flex items-center shrink-0">
            <MiramaIcon />
          </HoverLink>

          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

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
                        <BreadcrumbPage className="text-[10px] font-black uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
                          {label}
                        </BreadcrumbPage>
                      ) : (
                        <HoverLink
                          href={accumulatedPaths[index]}
                          className="text-[10px] font-bold uppercase tracking-tighter text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
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
        </div>

        <div className="flex-1 max-w-sm hidden lg:block">
          <div className="group relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="System search..."
              className="h-8 w-full pl-9 pr-10 bg-neutral-100/50 dark:bg-neutral-900/50 border-transparent focus-visible:bg-white dark:focus-visible:bg-black focus-visible:border-neutral-200 dark:focus-visible:border-neutral-800 focus-visible:ring-0 text-[11px] font-medium rounded-lg transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black pointer-events-none opacity-50">
              <Command className="size-2" />
              <span className="text-[8px] font-bold">K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="icon"
            className={cn(
              'h-8 w-8 rounded-lg transition-all',
              currFav
                ? 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10'
                : 'text-neutral-400 border-transparent bg-transparent',
            )}
            onClick={handleToggleFav}
          >
            <Star size={13} className={cn(currFav && 'fill-yellow-500')} />
          </Button>

          <div className="h-6 w-px bg-text/30 mx-1" />

          <HeaderProfile session={session} />
        </div>
      </div>
    </header>
  )
}

export default AppHeader
