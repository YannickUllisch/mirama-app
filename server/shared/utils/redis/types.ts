import type { Prisma } from '@/prisma/generated/client'
import type { BaseAdapter } from './Adapters'

export type PrismaQueryAction =
  | 'findFirst'
  | 'findFirstOrThrow'
  | 'findUnique'
  | 'findUniqueOrThrow'
  | 'findMany'
  | 'aggregate'
  | 'count'
  | 'groupBy'
  | 'findRaw'
  | 'runCommandRaw'
  | 'queryRaw'
  | 'aggregateRaw'

export type PrismaMutationAction =
  | 'create'
  | 'createMany'
  | 'update'
  | 'updateMany'
  | 'upsert'
  | 'delete'
  | 'deleteMany'
  | 'executeRaw'
  | 'executeRawUnsafe'

export type PrismaAction = PrismaQueryAction | PrismaMutationAction

export type CreatePrismaRedisCache = {
  models?: {
    model: Prisma.ModelName
    cacheKey?: string
    cacheTime?: number
    excludeMethods?: PrismaQueryAction[]
    invalidateRelated?: Prisma.ModelName[]
  }[]
  adapter: BaseAdapter
  excludeModels?: Prisma.ModelName[]
  excludeMethods?: PrismaQueryAction[]
  prefix?: string
}
