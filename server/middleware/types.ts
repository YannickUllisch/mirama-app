import type { OrganizationRole, TenantRole } from '@prisma/client'
import type { NextRequest } from 'next/server'
import type { Session } from 'next-auth'
import type { Logger } from 'pino'
import type { AppContext } from '../shared/infrastructure/types'

// The starting point for all requests
export type BaseContext = {
  requestId: string
  logger: Logger
  startTime: number
}

export type AuthConfig =
  | {
      allowedTenantRoles: TenantRole[] | 'ANY'
      allowedOrgRoles?: OrganizationRole[] | 'ANY'
    }
  | {
      allowedTenantRoles?: TenantRole[] | 'ANY'
      allowedOrgRoles: OrganizationRole[] | 'ANY'
    }
  | {
      allowedTenantRoles: TenantRole[] | 'ANY'
      allowedOrgRoles: OrganizationRole[] | 'ANY'
    }

type AuthContextBase = BaseContext & {
  ctx: AppContext
}

export type PrivateAuthContext = AuthContextBase & {
  isPublic: false
  session: Session
}

export type PublicAuthContext = AuthContextBase & {
  isPublic: true
  session: null
}

export type AuthContext = PrivateAuthContext | PublicAuthContext

export type HandlerData<TParams = any, TBody = any> = {
  params: TParams
  body: TBody
}

// Final Handler Type
export type Handler<TContext = BaseContext, TData = HandlerData<any, any>> = (
  req: NextRequest,
  context: TContext,
  data: TData,
) => Promise<Response>
