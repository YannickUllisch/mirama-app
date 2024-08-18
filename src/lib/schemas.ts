import { Role } from '@prisma/client'
import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z
      .string()
      .min(6, { message: 'Password needs to include at least 6 characters' }),
    passwordValidation: z.string(),
  })
  .refine((data) => data.password === data.passwordValidation, {
    message: 'Passwords do not match',
    path: ['passwordValidation'],
  })

const RoleTypes = z.enum([Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER])

export const InvitationSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must include at least 3 characters',
  }),
  email: z.string().email({
    message: 'Invalid email format',
  }),
  role: RoleTypes.default('USER'),
})

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name needs to contain at least 1 character' }),
  startDate: z.date(),
  endDate: z.date(),
})

const PriorityType = z.enum(['LOW', 'MEDIUM', 'HIGH'])
const TaskStatusType = z.enum(['TODO', 'DOING', 'INREVIEW', 'DONE'])

export const TaskSchema = z.object({
  assignedToId: z.string().nullable().optional(),
  dueDate: z.date().nullable().optional(),
  title: z.string().min(1, { message: 'Title cannot be empty.' }),
  description: z.string().nullable().optional(),
  priority: PriorityType.default('LOW'),
  status: TaskStatusType.default('TODO'),
  projectId: z.string(),
  tags: z.string().array().optional(),
})
