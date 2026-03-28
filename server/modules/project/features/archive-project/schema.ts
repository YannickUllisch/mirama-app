import { z } from 'zod'

export const ArchiveProjectSchema = z.object({
  archived: z.boolean(),
})

export type ArchiveProjectRequest = z.infer<typeof ArchiveProjectSchema>
