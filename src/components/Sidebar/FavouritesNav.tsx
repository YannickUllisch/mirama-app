'use client'

import { Star, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@ui/sidebar'

import { Button } from '@ui/button'
import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@ui/collapsible'
import { cn } from '@src/lib/utils'
import useSWR from 'swr'
import { type Favourite, FavouriteType } from '@prisma/client'

const FavoritesNav = () => {
  const [isOpen, setIsOpen] = useState(true)

  const { data: favs } = useSWR<Favourite[]>({
    url: 'favourite',
    type: FavouriteType.ROUTE,
  })

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden  p-0 px-2">
        <div className="flex items-center justify-between px-2 py-1">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="p-0 hover:bg-transparent">
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200',
                  !isOpen && '-rotate-90',
                )}
              />
              <span className="ml-2 text-text/80">Favourites</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <SidebarMenu>
            {favs?.map((favorite) => (
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
                        <span className="truncate">{favorite.data}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

export default FavoritesNav
