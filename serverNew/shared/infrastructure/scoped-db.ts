import db from '@db'

export type ScopedDb = ReturnType<typeof getScopedDb>

export const getScopedDb = (tenantId: string, organizationId?: string) => {
  if (!tenantId) {
    throw new Error('ScopedDb initialized without a tenantId.')
  }

  return db.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // 1. Define the scopes
          const tenantScopedModels = ['Organization']
          const orgScopedModels = [
            'Project',
            'Task',
            'Member',
            'Team',
            'Tag',
            'OrganizationInvitation',
          ]

          const isTenantScoped = tenantScopedModels.includes(model)
          const isOrgScoped = orgScopedModels.includes(model)

          // Guard Logic: Prevent operations if context is missing for these models
          if (isTenantScoped && !tenantId) {
            throw new Error(
              `GUARD: Attempted ${operation} on tenant-scoped ${model} without tenantId.`,
            )
          }
          if (isOrgScoped && (!tenantId || !organizationId)) {
            throw new Error(
              `GUARD: Attempted ${operation} on org-scoped ${model} without full context.`,
            )
          }

          // Defining automatic filters by tenantId and orgId
          const contextFilter: any = {}

          if (isTenantScoped || isOrgScoped) {
            contextFilter.tenantId = tenantId
          }

          if (isOrgScoped && organizationId) {
            contextFilter.organizationId = organizationId
          }

          const hasWhereClause = [
            'findFirst',
            'findMany',
            'findUnique',
            'findUniqueOrThrow',
            'update',
            'updateMany',
            'delete',
            'deleteMany',
            'count',
            'aggregate',
          ].includes(operation)

          if (hasWhereClause && Object.keys(contextFilter).length > 0) {
            const queryArgs = args as { where?: any }
            queryArgs.where = {
              ...queryArgs.where,
              ...contextFilter,
            }
          }

          // Automatically set orgId and tenantId on create of new models.
          if (operation === 'create' || operation === 'createMany') {
            const createArgs = args as { data: any }

            const inject = (item: any) => ({
              ...item,
              ...contextFilter,
            })

            if (Array.isArray(createArgs.data)) {
              createArgs.data = createArgs.data.map(inject)
            } else {
              createArgs.data = inject(createArgs.data)
            }
          }

          return query(args)
        },
      },
    },
  })
}
