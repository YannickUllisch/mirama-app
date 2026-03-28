import { z } from 'zod'

export const DeleteTasksBulkSchema = z.object({
  ids: z.string().array().min(1),
  projectId: z.string().min(1),
})

export type DeleteTasksBulkRequest = z.infer<typeof DeleteTasksBulkSchema>
