import { FavouriteType } from '@/prisma/generated/client'
import { z } from 'zod'

export const CreateFavouriteSchema = z.object({
  type: z.enum(FavouriteType),
  data: z.string().min(1, 'Data is required'),
})

export type CreateFavouriteRequest = z.infer<typeof CreateFavouriteSchema>
