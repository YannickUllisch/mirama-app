'use client'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@ui/sidebar'
import { ChevronDown, Star } from 'lucide-react'
import Link from 'next/link'

import apiRequest from '@hooks/query'
import { FavouriteType } from '@prisma/client'
import { capitalize, cn } from '@src/lib/utils'
import { Button } from '@ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@ui/collapsible'
import { useState } from 'react'

const FavoritesNav = () => {
  const [isOpen, setIsOpen] = useState(true)

  const { data: favs } = apiRequest.favourite.fetchByType.useQuery(
    FavouriteType.ROUTE,
  )

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden p-0 px-2">
        <div className="flex items-center justify-between px-2 py-1">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent text-sidebar-foreground"
            >
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200',
                  !isOpen && '-rotate-90',
                )}
              />
              <span className="ml-2">Favourites</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <SidebarMenu>
            {favs?.map((favorite) => {
              const previewName = favorite.data
                .replace('app', 'Dashboard')
                .split('/')
                .at(-1)
              return (
                <SidebarMenuItem key={favorite.id}>
                  <div className="flex items-center w-full gap-2 px-2">
                    <SidebarMenuButton
                      asChild
                      className={cn('flex-1 justify-between')}
                    >
                      <Link prefetch={false} href={favorite.data}>
                        <div className="flex gap-2 items-center">
                          <Star
                            size={14}
                            className="h-4 w-4 mr-2 text-yellow-500"
                          />
                          <span className="truncate">
                            {capitalize(previewName ?? '')}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

export default FavoritesNav
