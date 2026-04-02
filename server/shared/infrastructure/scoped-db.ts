import db from '@db'

export type ScopedDb = ReturnType<typeof getScopedDb>

const TENANT_SCOPED_MODELS = new Set(['Organization'])

// Models where tenantId=null means system-level (shared across all tenants).
const TENANT_INCLUSIVE_MODELS = new Set(['Role', 'Policy'])

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
          const isTenantInclusive = TENANT_INCLUSIVE_MODELS.has(model)
          const isOrgScoped = ORG_SCOPED_MODELS.has(model)

          if (!isTenantScoped && !isTenantInclusive && !isOrgScoped)
            return query(args)

          // Guard: prevent operations without required context
          // For org-scoped CREATEs, allow if organizationId is in the data
          if (isOrgScoped && !organizationId) {
            if (CREATE_OPERATIONS.has(operation)) {
              const createArgs = args as {
                data: Record<string, unknown> | Record<string, unknown>[]
              }
              const dataItem = Array.isArray(createArgs.data)
                ? createArgs.data[0]
                : createArgs.data
              if (!dataItem?.organizationId) {
                throw new Error(
                  `GUARD: Attempted ${operation} on org-scoped ${model} without organizationId.`,
                )
              }
              // organizationId already in data, pass through without injection
              return query(args)
            }
            throw new Error(
              `GUARD: Attempted ${operation} on org-scoped ${model} without organizationId.`,
            )
          }

          // Build the context filter that will be auto-injected
          // Tenant-scoped models get tenantId and org-scoped models get organizationId only
          const contextFilter: Record<string, unknown> = {}
          if (isTenantScoped) {
            contextFilter.tenantId = tenantId
          }
          if (isOrgScoped && organizationId) {
            contextFilter.organizationId = organizationId
          }

          // READ operations: inject into where clause
          if (
            READ_OPERATIONS.has(operation) ||
            WRITE_WHERE_OPERATIONS.has(operation)
          ) {
            const queryArgs = args as { where?: Record<string, unknown> }
            if (isTenantInclusive) {
              // Include both tenant-owned and system-level (tenantId = null) records
              queryArgs.where = {
                ...queryArgs.where,
                OR: [{ tenantId }, { tenantId: null }],
              }
            } else {
              queryArgs.where = { ...queryArgs.where, ...contextFilter }
            }
          }

          if (CREATE_OPERATIONS.has(operation)) {
            const createArgs = args as {
              data: Record<string, unknown> | Record<string, unknown>[]
            }

            const inject = (item: Record<string, unknown>) => {
              const newItem = { ...item }

              // Inject if the key is missing or null
              if ((isTenantScoped || isTenantInclusive) && !newItem.tenantId) {
                newItem.tenantId = tenantId
              }
              // Only inject if organizationId is missing AND we actually have a scope ID
              if (isOrgScoped && organizationId && !newItem.organizationId) {
                newItem.organizationId = organizationId
              }

              return newItem
            }

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
          }

          return query(args)
        },
      },
    },
  })
}
