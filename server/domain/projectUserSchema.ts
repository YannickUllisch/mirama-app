import z from 'zod'

export const UpdateProjectUsersSchema = z.object({
  userIds: z.array(z.string().uuid()).nonempty(),
  setAsManagers: z.boolean().optional(),
})

export type UpdateProjectUsersInput = z.infer<typeof UpdateProjectUsersSchema>
