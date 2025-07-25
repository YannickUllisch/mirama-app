import {
  PriorityTypeSchema,
  StatusTypeSchema,
  TaskStatusTypeSchema,
} from '@/prisma/zod'
import { Role, TaskType } from '@prisma/client'
import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password needs to include at least 6 characters' }),
})

export const VerifySchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  confirmationCode: z
    .string()
    .min(6, {
      message: 'Confirmation code must be 6 digits',
    })
    .max(6, {
      message: 'Confirmation code must be 6 digits',
    })
    .regex(/^\d{6}$/, {
      message: 'Confirmation code must contain only numbers',
    }),
})

export const EmailLoginSchema = z.object({
  email: z.string().email({
    message: 'Invalid email format',
  }),
})

export const ContactSchema = z.object({
  firstName: z.string().min(2, { message: 'Please define your First Name' }),
  lastName: z.string().min(2, { message: 'Please define your Last Name' }),
  email: z.string().email({ message: 'Invalid email format' }),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: 'Please enter a valid phone number',
    })
    .optional(), // Make phone optional if required
  message: z
    .string()
    .min(20, { message: 'Please add atleast 20 characters to your Message' })
    .max(1000, {
      message: 'Please keep your message concise and below 1000 characters',
    }),
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

export const ProjectSchema = z
  .object({
    name: z.string().min(1, { message: 'Name cannot be empty.' }),
    description: z.string().nullable().optional(),
    startDate: z.date({ message: 'Start Date has to be defined' }),
    endDate: z.date({ message: 'End Date has to be defined' }),
    priority: PriorityTypeSchema.default('LOW'),
    status: StatusTypeSchema.default('ACTIVE'),
    budget: z.number().nullable().optional(),
    teamId: z.string().min(10, { message: 'Please Choose a valid Team' }),
    tags: z.string().array().optional(),
    users: z.string().array().optional(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

export const TaskSchema = z
  .object({
    assignedToId: z.string().nullable().optional(),
    dueDate: z.date({ message: 'Due Date has to be defined' }),
    startDate: z.date({ message: 'Start Date has to be defined' }),
    title: z.string().min(1, { message: 'Title cannot be empty.' }),
    description: z.string().nullable().optional(),
    priority: PriorityTypeSchema.default('LOW'),
    status: TaskStatusTypeSchema.default('NEW'),
    projectId: z.string().min(10, { message: 'Please Choose a valid Project' }),
    tags: z.string().array().optional(),
    subtasks: z.string().array().optional(),
    parentId: z.string().optional(),
    type: z.nativeEnum(TaskType),
  })
  .refine((data) => data.startDate <= data.dueDate, {
    message: 'Start Date must be before or equal to Due Date',
    path: ['startDate'],
  })

export const MilestoneSchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  title: z.string(),
  colors: z.string(),
  projectId: z.string(),
})
