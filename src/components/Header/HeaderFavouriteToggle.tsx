// src/components/Header/HeaderFavouriteToggle.tsx
'use client'
import { FavouriteType } from '@/prisma/generated/client'
import apiRequest from '@hooks'
import { cn } from '@src/lib/utils'
import { Button } from '@ui/button'
import { Star } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

const HeaderFavouriteToggle = () => {
  const pathname = usePathname()

  const { data: favs } = apiRequest.favourite.fetchByType.useQuery(
    FavouriteType.ROUTE,
  )
  const createFavMutation = apiRequest.favourite.create.useMutation()
  const deleteFavMutation = apiRequest.favourite.delete.useMutation()

  const currFav = useMemo(() => {
    return favs?.find((fav) => fav.data === pathname)
  }, [favs, pathname])

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
  )
}

export default HeaderFavouriteToggle
