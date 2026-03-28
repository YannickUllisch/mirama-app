import { z } from 'zod'

export const FavouriteIdParams = z.object({
  id: z.string().min(1),
})

export type FavouriteIdRequest = z.infer<typeof FavouriteIdParams>
