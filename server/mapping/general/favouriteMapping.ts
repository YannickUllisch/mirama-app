import type { Favourite } from '@prisma/client'
import type { FavouriteResponseType } from '@server/domain/favouriteSchema'

export const FavouriteMapper = {
  mapDefaultToApi: (input: Favourite): FavouriteResponseType => {
    return {
      data: input.data,
      id: input.id,
      type: input.type,
      memberId: input.memberId ?? '',
    }
  },
}
