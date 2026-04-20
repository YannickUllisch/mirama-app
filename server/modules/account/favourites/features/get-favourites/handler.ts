import type { FavouriteType } from '@/prisma/generated/client'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { FavouriteRepository } from '../../infrastructure/favourite.repo'
import { toFavouriteResponse } from '../response'

export const GetFavouritesQuery =
  ({ db }: AppContext) =>
  async (memberId: string, type: FavouriteType) => {
    const repo = FavouriteRepository(db)
    const favourites = await repo.findByMemberAndType(memberId, type)

    return favourites.map(toFavouriteResponse)
  }
