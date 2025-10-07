import type { Favourite } from '@prisma/client'
import type { FavouriteResponseType } from '@server/domain/favouriteSchema'

const mapDefaultToApi = (input: Favourite): FavouriteResponseType => {
  return {
    data: input.data,
    id: input.id,
    type: input.type,
    userId: input.userId ?? '',
  }
}

export const FavouriteMapper = {
  mapDefaultToApi,
}
