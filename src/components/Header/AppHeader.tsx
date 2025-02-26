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
import { capitalize } from '@src/lib/utils'
import Link from 'next/link'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Star } from 'lucide-react'
import { APP_HEADER_HEIGHT } from '@src/lib/constants'
import useSWR, { mutate } from 'swr'
import { type Favourite, FavouriteType } from '@prisma/client'
import { postResource } from '@src/lib/api/postResource'
import { deleteResources } from '@src/lib/api/deleteResource'

const AppHeader = () => {
  const pathname = usePathname()

  const { data: favs, mutate: updateFavs } = useSWR<Favourite[]>({
    url: 'favourite',
    type: FavouriteType.ROUTE,
  })

  const currFav = useMemo(() => {
    return favs?.find((fav) => fav.data === pathname)
  }, [favs, pathname])

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
      style={{ zIndex: 50 }}
      className={`sticky top-0 w-full bg-sidebar flex gap-2 h-[${APP_HEADER_HEIGHT}px] p-4 justify-between `}
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
                    <Link
                      href={accumulatedPaths[index]}
                      passHref
                      prefetch={false}
                    >
                      {capitalize(
                        segment.replace(/-/g, ' ').replace('app', 'Dashboard'),
                      )}
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
      <div className="flex justify-center items-center md:hidden">
        <Link href={'/app'}>
          <span className="font-semibold text-lg">.mirage</span>
        </Link>
      </div>
      <div
        className={`flex justify-center items-center ${
          currFav ? 'text-yellow-500' : ''
        }`}
      >
        <Button
          variant={'ghost'}
          onClick={() => {
            if (!currFav) {
              const newFav = {
                id: Date.now().toString(),
                type: FavouriteType.ROUTE,
                data: pathname,
                userId: '',
              }

              updateFavs((existingFavs: Favourite[] = []) => [
                ...existingFavs,
                newFav,
              ])

              postResource('favourite', {
                type: FavouriteType.ROUTE,
                data: pathname,
              })
                .then(() => {
                  mutate({ url: 'favourite', type: FavouriteType.ROUTE })
                })
                .catch(() => {
                  // Rollback if the request fails
                  mutate({ url: 'favourite', type: FavouriteType.ROUTE }, favs)
                })
            } else {
              updateFavs((existingFavs?: Favourite[]) => {
                if (!existingFavs) return []
                return existingFavs.filter((fav) => fav.id !== currFav?.id)
              })

              deleteResources('favourite', [currFav.id])
                .then(() => {
                  mutate({ url: 'favourite', type: FavouriteType.ROUTE })
                })
                .catch(() => {
                  mutate({ url: 'favourite', type: FavouriteType.ROUTE }, favs)
                })
            }
          }}
        >
          <Star size={18} />
        </Button>
      </div>
    </header>
  )
}

export default AppHeader
