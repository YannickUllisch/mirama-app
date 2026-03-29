import db from '@db'

export type ScopedDb = ReturnType<typeof getScopedDb>

const TENANT_SCOPED_MODELS = new Set(['Organization'])
const ORG_SCOPED_MODELS = new Set([
  'Project',
  'Task',
  'Member',
  'Team',
  'Tag',
  'OrganizationInvitation',
  'ProjectMember',
  'Milestone',
  'Comment',
  'Expense',
  'Notification',
  'Favourite',
])

const READ_OPERATIONS = new Set([
  'findFirst',
  'findMany',
  'findUnique',
  'findUniqueOrThrow',
  'count',
  'aggregate',
  'groupBy',
])

const WRITE_WHERE_OPERATIONS = new Set([
  'update',
  'updateMany',
  'delete',
  'deleteMany',
])

const CREATE_OPERATIONS = new Set(['create', 'createMany'])

const UPSERT_OPERATION = 'upsert'

export const getScopedDb = (tenantId: string, organizationId?: string) => {
  if (!tenantId) {
    throw new Error('ScopedDb initialized without a tenantId.')
  }

  return db.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const isTenantScoped = TENANT_SCOPED_MODELS.has(model)
          const isOrgScoped = ORG_SCOPED_MODELS.has(model)

          if (!isTenantScoped && !isOrgScoped) return query(args)

          // Guard: prevent operations without required context
          if (isOrgScoped && !organizationId) {
            throw new Error(
              `GUARD: Attempted ${operation} on org-scoped ${model} without organizationId.`,
            )
          }

          // Build the context filter that will be auto-injected
          const contextFilter: Record<string, string> = { tenantId }
          if (isOrgScoped && organizationId) {
            contextFilter.organizationId = organizationId
          }

          // READ operations: inject into where clause
          if (
            READ_OPERATIONS.has(operation) ||
            WRITE_WHERE_OPERATIONS.has(operation)
          ) {
            const queryArgs = args as { where?: Record<string, unknown> }
            queryArgs.where = { ...queryArgs.where, ...contextFilter }
          }

          // CREATE operations: inject into data
          if (CREATE_OPERATIONS.has(operation)) {
            const createArgs = args as {
              data: Record<string, unknown> | Record<string, unknown>[]
            }
            const inject = (item: Record<string, unknown>) => ({
              ...item,
              ...contextFilter,
            })

            createArgs.data = Array.isArray(createArgs.data)
              ? createArgs.data.map(inject)
              : inject(createArgs.data)
          }

          // UPSERT: inject into where, update, and create
          if (operation === UPSERT_OPERATION) {
            const upsertArgs = args as {
              where?: Record<string, unknown>
              create?: Record<string, unknown>
              update?: Record<string, unknown>
            }
            upsertArgs.where = { ...upsertArgs.where, ...contextFilter }
            upsertArgs.create = { ...upsertArgs.create, ...contextFilter }
            // update doesn't need context injected — the where already scoped it
          }

          return query(args)
        },
      },
    },
  })
}
