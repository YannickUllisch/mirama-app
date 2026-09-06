import { z } from 'zod'

export const ViewTypeSchema = z.enum(['Sidebar', 'Table', 'Kanban', 'Gantt'])
export type ViewType = z.infer<typeof ViewTypeSchema>

export const ViewStateResponseSchema = z.object({
  id: z.uuid(),
  surfaceKey: z.string(),
  viewType: ViewTypeSchema,
  stateJson: z.string(),
  lastModified: z.coerce.date().nullable().optional(),
})
export type ViewStateResponse = z.infer<typeof ViewStateResponseSchema>

export const SaveViewStateSchema = z.object({
  surfaceKey: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-zA-Z0-9:_-]+$/, {
      message:
        "Surface key may only contain letters, digits, ':', '_' and '-'.",
    }),
  viewType: ViewTypeSchema,
  stateJson: z.string().min(1).max(65_536),
})
export type SaveViewStateCommand = z.infer<typeof SaveViewStateSchema>

export const ClientSummarySchema = z.object({
  clientId: z.uuid(),
  name: z.string(),
  clientType: z.string(),
  status: z.string(),
})
export type ClientSummary = z.infer<typeof ClientSummarySchema>
