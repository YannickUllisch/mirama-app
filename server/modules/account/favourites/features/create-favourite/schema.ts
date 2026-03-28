import { FavouriteType } from '@prisma/client'
import { z } from 'zod'

export const CreateFavouriteSchema = z.object({
  type: z.nativeEnum(FavouriteType),
  data: z.string().min(1, 'Data is required'),
})

export type CreateFavouriteRequest = z.infer<typeof CreateFavouriteSchema>
