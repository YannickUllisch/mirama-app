// src/modules/pm/projects/workflow/workflow.types.ts
import { z } from 'zod'

export const StatusCategorySchema = z.enum([
  'NotStarted',
  'Active',
  'Done',
  'Cancelled',
])
export type StatusCategory = z.infer<typeof StatusCategorySchema>

export const PriorityResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  level: z.number().int(),
  isDefault: z.boolean(),
})
export type PriorityResponse = z.infer<typeof PriorityResponseSchema>

export const StatusResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  color: z.string().nullable().optional(),
  category: z.string(),
  position: z.number().int(),
  isDefault: z.boolean(),
  isTerminal: z.boolean(),
})
export type StatusResponse = z.infer<typeof StatusResponseSchema>

export const WorkflowResponseSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  projectStatuses: z.array(StatusResponseSchema),
  projectPriorities: z.array(PriorityResponseSchema),
  taskStatuses: z.array(StatusResponseSchema),
  taskPriorities: z.array(PriorityResponseSchema),
})
export type WorkflowResponse = z.infer<typeof WorkflowResponseSchema>

export const AddStatusSchema = z.object({
  name: z.string().min(1),
  category: StatusCategorySchema,
  color: z.string().nullable().optional(),
  isDefault: z.boolean().optional(),
  isTerminal: z.boolean().optional(),
})
export type AddStatusCommand = z.infer<typeof AddStatusSchema>

export const UpdateStatusSchema = z.object({
  name: z.string().min(1),
  category: StatusCategorySchema,
  color: z.string().nullable().optional(),
  isTerminal: z.boolean().optional(),
})
export type UpdateStatusCommand = z.infer<typeof UpdateStatusSchema>

export const AddPrioritySchema = z.object({
  name: z.string().min(1),
  level: z.number().int(),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  isDefault: z.boolean().optional(),
})
export type AddPriorityCommand = z.infer<typeof AddPrioritySchema>

export const UpdatePrioritySchema = z.object({
  name: z.string().min(1),
  level: z.number().int(),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
})
export type UpdatePriorityCommand = z.infer<typeof UpdatePrioritySchema>
