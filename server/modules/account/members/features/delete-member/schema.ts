import { z } from 'zod'

export const MemberIdParams = z.object({
  id: z.string(),
})

export type MemberIdRequest = z.infer<typeof MemberIdParams>
