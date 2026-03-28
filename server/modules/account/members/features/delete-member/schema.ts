import { z } from 'zod'

export const MemberIdParams = z.object({
  id: z.string().uuid(),
})

export type MemberIdRequest = z.infer<typeof MemberIdParams>
