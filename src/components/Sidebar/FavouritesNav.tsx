'use client'

import { Star, PlusSquare, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@ui/sidebar'

import { Button } from '@ui/button'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@ui/collapsible'
import { cn } from '@src/lib/utils'

interface Favorite {
  id: string
  name: string
  href: string
}

interface FavoritesNavProps {
  favorites: Favorite[]
  onAddFavorite?: () => void
}

const FavoritesNav = ({ favorites, onAddFavorite }: FavoritesNavProps) => {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
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

          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:text-accent-foreground"
            onClick={onAddFavorite}
          >
            <PlusSquare className="h-4 w-4" />
          </Button>
        </div>
        <CollapsibleContent>
          <SidebarMenu>
            {favorites.map((favorite) => (
              <SidebarMenuItem>
                <div className="flex items-center w-full gap-2 px-2">
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'flex-1 justify-between',
                      pathname.includes(favorite.href) && 'bg-accent',
                    )}
                  >
                    <Link prefetch={false} href={favorite.href}>
                      <div className="flex gap-2 items-center">
                        <Star size={14} className="h-4 w-4 mr-2" />
                        <span className="truncate">{favorite.name}</span>
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
