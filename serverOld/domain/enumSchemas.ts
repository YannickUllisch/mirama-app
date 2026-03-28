import {
  OrganizationRole,
  FavouriteType as PrismaFavouriteType,
  PriorityType as PrismaPriorityType,
  StatusType as PrismaStatusType,
  TaskStatusType as PrismaTaskStatusType,
  TaskType as PrismaTaskType,
  TenantRole,
} from '@prisma/client'
import z from 'zod'

export const OrganizationRoleSchema = z.nativeEnum(OrganizationRole)
export const TenantRoleSchema = z.nativeEnum(TenantRole)

export const PriorityTypeSchema = z.nativeEnum(PrismaPriorityType)
export const StatusTypeSchema = z.nativeEnum(PrismaStatusType)
export const TaskStatusTypeSchema = z.nativeEnum(PrismaTaskStatusType)
export const TaskTypeSchema = z.nativeEnum(PrismaTaskType)
export const FavouriteTypeSchema = z.nativeEnum(PrismaFavouriteType)

export type OrganizationRoleType = z.infer<typeof OrganizationRoleSchema>
export type TenantRoleType = z.infer<typeof TenantRoleSchema>
export type PriorityType = z.infer<typeof PriorityTypeSchema>
export type StatusType = z.infer<typeof StatusTypeSchema>
export type TaskStatusType = z.infer<typeof TaskStatusTypeSchema>
export type TaskType = z.infer<typeof TaskTypeSchema>
export type FavouriteType = z.infer<typeof FavouriteTypeSchema>
