import type { AppContext } from '@/server/shared/infrastructure/types'
import type { FavouriteType } from '@prisma/client'
import { FavouriteRepository } from '../../infrastructure/favourite.repo'
import { toFavouriteResponse } from '../response'

export const GetFavouritesQuery =
  ({ db, logger }: AppContext) =>
  async (memberId: string, type: FavouriteType) => {
    logger.info({ type }, 'Fetching favourites by type')

    const repo = FavouriteRepository(db)
    const favourites = await repo.findByMemberAndType(memberId, type)

    return favourites.map(toFavouriteResponse)
  }
