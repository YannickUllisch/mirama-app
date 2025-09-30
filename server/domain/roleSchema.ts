import { Role } from '@prisma/client'
import z from 'zod'

export const RoleSchema = z.nativeEnum(Role)
