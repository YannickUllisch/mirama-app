import { FavouriteType } from '@/prisma/generated/client'
import { z } from 'zod'

export const GetFavouritesParams = z.object({
  type: z.nativeEnum(FavouriteType),
})

export type GetFavouritesRequest = z.infer<typeof GetFavouritesParams>
