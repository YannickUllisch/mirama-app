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
import { capitalize } from '@src/lib/utils'
import {} from '@ui/avatar'
import { Input } from '@ui/input'
import { Separator } from '@ui/separator'
import { Search, Star } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import HoverLink from '../HoverLink'
import { Button } from '../ui/button'
import { SidebarTrigger } from '../ui/sidebar'
import HeaderProfile from './HeaderProfile'

const AppHeader = () => {
  const pathname = usePathname()
  const { data: session } = useSession()

  const { data: favs } = apiRequest.favourite.fetchByType.useQuery(
    FavouriteType.ROUTE,
  )

  const { mutate: useDeleteFavs } = apiRequest.favourite.delete.useMutation()
  const { mutate: useCreateFav } = apiRequest.favourite.create.useMutation()

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
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="flex h-14 items-center gap-4 px-4 justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-sidebar-foreground" />
          <HoverLink href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold text-sidebar-foreground">
              .mirama
            </span>
          </HoverLink>

          <Separator
            orientation="vertical"
            className="h-4 md:block hidden bg-text"
          />

          {pathSegments.map((segment, index) => (
            <Breadcrumb key={segment} className="md:block hidden">
              <BreadcrumbList>
                {index < pathSegments.length - 1 ? (
                  <>
                    <BreadcrumbItem>
                      <HoverLink
                        href={accumulatedPaths[index]}
                        passHref
                        prefetch={false}
                        className="text-xs"
                      >
                        {capitalize(
                          segment
                            .replace(/-/g, ' ')
                            .replace('app', 'Dashboard'),
                        )}
                      </HoverLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <div className="flex gap-2 items-center text-xs">
                        {capitalize(
                          segment
                            .replace(/-/g, ' ')
                            .replace('app', 'Dashboard'),
                        )}
                      </div>
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          ))}
        </div>

        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search data, notebooks, recents, and more..."
              className="w-full pl-9 pr-20 bg-gray-50 border-sidebar-border focus-visible:ring-sidebar-ring"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-sidebar-border bg-white px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>P
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={'ghost'}
            className={`p-2 ${currFav ? 'text-yellow-500' : ''}`}
            onClick={() => {
              if (!currFav) {
                const newFav = {
                  id: Date.now().toString(),
                  type: FavouriteType.ROUTE,
                  data: pathname,
                  userId: session?.user.id,
                }

                useCreateFav(newFav)
              } else {
                useDeleteFavs([currFav.id])
              }
            }}
          >
            <Star size={14} />
          </Button>
          <HeaderProfile session={session} />
        </div>
      </div>
    </header>
  )
}

export default AppHeader
