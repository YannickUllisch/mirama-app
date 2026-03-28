import { z } from 'zod'

export const GetTasksByProjectParams = z.object({
  projectId: z.string().min(1),
})

export type GetTasksByProjectRequest = z.infer<typeof GetTasksByProjectParams>
