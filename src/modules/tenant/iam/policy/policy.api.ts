import type {
  PaginatedResponse,
  PaginationParams,
} from '@src/modules/api.types'
import { api } from '@src/modules/shared/api'
import type {
  ExtendedColumnFilter,
  TableApiParams,
} from '@src/types/data-table'

import type { AccessScope } from '../roles/role.types'
import type {
  AddPolicyStatementCommand,
  CreatePolicyCommand,
  PolicyResponse,
  UpdatePolicyCommand,
} from './policy.types'

function toGridifyExpression(f: ExtendedColumnFilter<PolicyResponse>): string {
  const field = f.id as string
  const val = f.value

  switch (f.operator) {
    case 'iLike':
      if (field === 'name') {
        return `(name=*${val}*|description=*${val}*)`
      }
      return `${field}=*${val}*`
    case 'notILike':
      if (field === 'name') {
        return `(name!=*${val}*,description!=*${val}*)`
      }
      return `${field}!=*${val}*`
    case 'eq':
      return `${field}=${val}`
    case 'ne':
      return `${field}!=${val}`
    case 'gt':
      return `${field}>${val}`
    case 'gte':
      return `${field}>=${val}`
    case 'lt':
      return `${field}<${val}`
    case 'lte':
      return `${field}<=${val}`
    case 'isEmpty':
      return `${field}=null`
    case 'isNotEmpty':
      return `${field}!=null`
    case 'inArray':
      if (Array.isArray(val) && val.length > 0) {
        return `(${val.map((v) => `${field}=${v}`).join('|')})`
      }
      return `${field}=${val}`
    case 'notInArray':
      if (Array.isArray(val) && val.length > 0) {
        return `(${val.map((v) => `${field}!=${v}`).join(',')})`
      }
      return `${field}!=${val}`
    case 'isBetween':
      if (Array.isArray(val) && val.length === 2) {
        return `(${field}>=${val[0]},${field}<=${val[1]})`
      }
      return ''
    default:
      return `${field}=${val}`
  }
}

export const fetchPolicyByIdFn = async (
  tenantId: string,
  policyId: string,
): Promise<PolicyResponse> => {
  const { data } = await api.get(`tenant/${tenantId}/policies/${policyId}`)
  return data
}

export const fetchPoliciesFn = async (
  tenantId: string,
  scope: AccessScope,
  params?: PaginationParams,
): Promise<PaginatedResponse<PolicyResponse>> => {
  const { data } = await api.get(`tenant/${tenantId}/policies/${scope}`, {
    params,
  })
  return data
}

export const fetchPoliciesServerTableFn = async (
  tenantId: string,
  scope: AccessScope,
  params: TableApiParams<PolicyResponse>,
): Promise<PaginatedResponse<PolicyResponse>> => {
  const gridifyParams: Record<string, string | number> = {
    page: params.page,
    pageSize: params.pageSize,
  }

  if (params.sort.length > 0) {
    gridifyParams.orderBy = params.sort
      .map((s) => `${s.id} ${s.desc ? 'desc' : 'asc'}`)
      .join(', ')
  }

  if (params.filters.length > 0) {
    const separator = params.joinOperator === 'or' ? '|' : ','
    const expressions = params.filters
      .map((f) => toGridifyExpression(f))
      .filter(Boolean)
    if (expressions.length > 0) {
      gridifyParams.filter = expressions.join(separator)
    }
  }

  const { data } = await api.get(`tenant/${tenantId}/policies/${scope}`, {
    params: gridifyParams,
  })
  return data
}

export const createPolicyFn = async (
  tenantId: string,
  payload: CreatePolicyCommand,
): Promise<PolicyResponse> => {
  const { data } = await api.post(`tenant/${tenantId}/policies`, payload)
  return data
}

export const updatePolicyFn = async (
  tenantId: string,
  policyId: string,
  payload: UpdatePolicyCommand,
): Promise<PolicyResponse> => {
  const { data } = await api.put(
    `tenant/${tenantId}/policies/${policyId}`,
    payload,
  )
  return data
}

export const deletePolicyFn = async (
  tenantId: string,
  policyId: string,
): Promise<void> => {
  await api.delete(`tenant/${tenantId}/policies/${policyId}`)
}

export const addPolicyStatementFn = async (
  tenantId: string,
  policyId: string,
  payload: AddPolicyStatementCommand,
): Promise<PolicyResponse> => {
  const { data } = await api.post(
    `tenant/${tenantId}/policies/${policyId}/statements`,
    payload,
  )
  return data
}

export const removePolicyStatementFn = async (
  tenantId: string,
  policyId: string,
  statementId: string,
): Promise<void> => {
  await api.delete(
    `tenant/${tenantId}/policies/${policyId}/statements/${statementId}`,
  )
}
