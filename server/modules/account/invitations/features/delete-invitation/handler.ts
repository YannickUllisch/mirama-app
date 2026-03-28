import type { AppContext } from '@/server/shared/infrastructure/types'
import { InvitationRepository } from '../../infrastructure/invitation.repo'

export const DeleteInvitationCommand =
  ({ db, logger }: AppContext) =>
  async (email: string) => {
    logger.info({ email }, 'Deleting invitation')

    const repo = InvitationRepository(db)
    await repo.remove(email)
  }
