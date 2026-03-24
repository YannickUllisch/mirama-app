import type { ScopedDb } from '@scopedDb'
import type { Logger } from 'pino'

export interface AppContext {
  db: ScopedDb
  logger: Logger
}
