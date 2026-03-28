import type { AppContext } from '@/server/shared/infrastructure/types'
import { FavouriteRepository } from '../../infrastructure/favourite.repo'

export const DeleteFavouriteCommand =
  ({ db, logger }: AppContext) =>
  async (id: string, memberId: string) => {
    logger.info({ id }, 'Deleting favourite')

    const repo = FavouriteRepository(db)
    await repo.remove(id, memberId)
  }
