import { z } from 'zod'

export const TaskIdParams = z.object({
  taskId: z.string().min(1),
})

export type TaskIdRequest = z.infer<typeof TaskIdParams>
