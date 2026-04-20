import type { Favourite } from '@/prisma/generated/client'

export type FavouriteResponse = {
  id: string
  type: string
  data: string
  memberId: string
}

export const toFavouriteResponse = (fav: Favourite): FavouriteResponse => ({
  id: fav.id,
  type: fav.type,
  data: fav.data,
  memberId: fav.memberId ?? '',
})
