import type { Prisma as PrismaType } from '@prisma/client'
import { Prisma } from '@prisma/client/extension'
import { defaultCacheMethods, defaultMutationMethods } from './cacheMethods'
import type {
  CreatePrismaRedisCache,
  PrismaMutationAction,
  PrismaQueryAction,
} from './types'

const createPrismaRedisCache = ({
  models,
  adapter,
  excludeModels = [],
  excludeMethods = [],
  prefix,
}: CreatePrismaRedisCache) =>
  Prisma.defineExtension((client) => {
    const validMethods = defaultCacheMethods.filter(
      (method) => !excludeMethods.includes(method),
    )

    return client.$extends({
      name: 'prisma-extension-redis-cache',
      query: {
        async $allOperations({ args: queryArgs, model, operation, query }) {
          const fetchFromPrisma = async (args: typeof queryArgs) => {
            const result = await query(args)
            return result
          }

          if (!model) {
            return fetchFromPrisma(queryArgs)
          }

          // Do not cache if the model should be excluded.
          if (excludeModels.includes(model as PrismaType.ModelName)) {
            return fetchFromPrisma(queryArgs)
          }

          let cacheKey = JSON.stringify(queryArgs ?? {}).replaceAll('*', '-')

          const modelKey = `${prefix}${model}~${operation}`

          const customModel = models?.find(
            (modelDef) => modelDef.model === model,
          )

          if (customModel?.cacheKey) {
            // If there is a cacheKey defined, it will overwrite the default naming.
            cacheKey = customModel.cacheKey
          }

          // If a custom model exists, check that this operation is permitted within it.
          if (
            customModel?.excludeMethods?.includes(
              operation as PrismaQueryAction,
            )
          ) {
            return fetchFromPrisma(queryArgs)
          }

          if (validMethods.includes(operation as PrismaQueryAction)) {
            // If it is a query operation, it should set up the cache function

            const result = await adapter.get(`${modelKey}~${cacheKey}`)

            if (!result) {
              const queryResult = await fetchFromPrisma(queryArgs)
              await adapter.set(`${modelKey}~${cacheKey}`, queryResult, {
                ttl: customModel?.cacheTime,
              })

              return queryResult
            }
            return result
          }
          if (
            defaultMutationMethods.includes(operation as PrismaMutationAction)
          ) {
            // If it is a mutate operation, it should invalidate the cache
            await adapter.invalidate(`${prefix}${model}~*`)

            // Also invalidate potential related models defined in the custom model.
            await Promise.all(
              customModel?.invalidateRelated?.map(async (relatedModel) =>
                adapter.invalidate(`${prefix}${relatedModel}~*`),
              ) ?? [],
            )
          }

          // Will run if mutation method and cache was invalidated.
          // Or if the method does not require a cache action
          return fetchFromPrisma(queryArgs)
        },
      },
    })
  })

export default createPrismaRedisCache
