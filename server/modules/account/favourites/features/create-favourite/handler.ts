import type { AppContext } from '@/server/shared/infrastructure/types'
import { FavouriteRepository } from '../../infrastructure/favourite.repo'
import { toFavouriteResponse } from '../response'
import type { CreateFavouriteRequest } from './schema'

export const CreateFavouriteCommand =
  ({ db, logger }: AppContext) =>
  async (memberId: string, input: CreateFavouriteRequest) => {
    logger.info({ type: input.type }, 'Creating favourite')

    const repo = FavouriteRepository(db)
    const favourite = await repo.create({ ...input, memberId })

    return toFavouriteResponse(favourite)
  }
