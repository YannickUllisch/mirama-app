import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'
import type { Logger } from 'pino'

export interface AppContext {
  db: ScopedDb
  logger: Logger
}
