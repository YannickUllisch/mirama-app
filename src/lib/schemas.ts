import { PriorityTypeSchema, TaskStatusTypeSchema } from '@/prisma/zod'
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

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password needs to include at least 6 characters' }),
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

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name needs to contain at least 1 character' }),
  startDate: z.date(),
  endDate: z.date(),
})

export const TaskSchema = z
  .object({
    assignedToId: z.string().nullable().optional(),
    dueDate: z.date({ message: 'Due Date has to be defined' }),
    startDate: z.date({ message: 'Start Date has to be defined' }),
    title: z.string().min(1, { message: 'Title cannot be empty.' }),
    description: z.string().nullable().optional(),
    priority: PriorityTypeSchema.default('LOW'),
    status: TaskStatusTypeSchema.default('NOT_STARTED'),
    projectId: z.string(),
    tags: z.string().array().optional(),
    parentId: z.string().optional(),
    categoryId: z.string().optional(),
  })
  .refine((data) => data.startDate <= data.dueDate, {
    message: 'Start Date must be before or equal to Due Date',
    path: ['startDate'],
  })

export const TaskCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  projectId: z.string(),
  color: z.string(),
})

export const ChangePasswordSchema = z
  .object({
    old: z.string(),
    new: z
      .string()
      .min(6, { message: 'Password needs to include at least 6 characters' }),
    newValidated: z.string(),
  })
  .refine((data) => data.new === data.newValidated, {
    message: 'New Password does not match',
    path: ['newValidated'],
  })
  .refine((data) => data.old !== data.new, {
    message: 'Please choose a different password',
    path: ['new'],
  })

export const MilestoneSchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  title: z.string(),
  colors: z.string(),
  projectId: z.string(),
})
