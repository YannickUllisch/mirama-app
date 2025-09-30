import { FavouriteType } from '@prisma/client'
import { z } from 'zod'

export const FavouriteTypeSchema = z.nativeEnum(FavouriteType)

export const CreateFavouriteSchema = z.object({
  type: FavouriteTypeSchema,
  data: z.string().min(1, 'Data is required'),
})

export const DeleteFavouritesSchema = z.array(
  z.string().min(1, 'Array of atleast one ID is required'),
)

// TypeScript types inferred from schemas
export type CreateFavouriteInput = z.infer<typeof CreateFavouriteSchema>
export type DeleteFavouritesInput = z.infer<typeof DeleteFavouritesSchema>
