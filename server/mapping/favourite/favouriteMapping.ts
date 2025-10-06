import type { Favourite } from '@prisma/client'
import type { FavouriteResponseType } from '@server/domain/favouriteSchema'

const mapDefaultToApi = (input: Favourite): FavouriteResponseType => {
  return {
    ...input,
    userId: input.userId ?? 'ERROR',
  }
}

export const FavouriteMapper = {
  mapDefaultToApi,
}
