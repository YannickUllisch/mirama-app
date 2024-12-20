import { auth } from '@auth'
import { Role } from '@prisma/client'
import { validateRequest } from '@src/lib/validateRequest'
import { DateTime } from 'luxon'

export const POST = async (_req: Request) => {
  try {
    // Checking Permissions
    const session = await auth()
    const validatedRequest = await validateRequest(session, [
      Role.OWNER,
      Role.ADMIN,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    // try {
    //   // await sendVerificationRequest({
    //   //   identifier: 'yannicku01@gmail.com',
    //   //   url: 'test/mirage.com',
    //   //   token: 'asdfasdf',
    //   // })
    // } catch (err) {
    //   console.error(err)
    //   throw err
    // }

    return Response.json({ success: true, message: 'yess' }, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
}
