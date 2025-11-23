import { FavouriteType } from '@prisma/client'
import { z } from 'zod'

export const FavouriteResponseSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(FavouriteType),
  data: z.string().min(1, 'Data is required'),
  userId: z.string().min(1, 'ID is required'),
})

export const CreateFavouriteSchema = z.object({
  type: z.nativeEnum(FavouriteType),
  data: z.string().min(1, 'Data is required'),
  userId: z.string().min(1, 'ID is required'),
})

// TypeScript types inferred from schemas
export type CreateFavouriteType = z.infer<typeof CreateFavouriteSchema>
export type FavouriteResponseType = z.infer<typeof FavouriteResponseSchema>
