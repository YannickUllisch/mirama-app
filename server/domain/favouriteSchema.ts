import { FavouriteType } from '@prisma/client'
import { z } from 'zod'

export const FavouriteTypeSchema = z.nativeEnum(FavouriteType)

export const CreateFavouriteSchema = z.object({
  type: FavouriteTypeSchema,
  data: z.string().min(1, 'Data is required'),
})

// TypeScript types inferred from schemas
export type CreateFavouriteInput = z.infer<typeof CreateFavouriteSchema>
