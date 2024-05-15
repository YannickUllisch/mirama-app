import { db } from '@src/lib/db'
import { auth } from '@/auth'

export const GET = auth(async (req) => {
  try {
    const _session = req.auth

    // const validatedRequest = await validateRequest(session)
    // if (validatedRequest) {
    //   return validatedRequest
    // }

    const projectId = req.nextUrl.searchParams.get('id') as string
    const response = await db.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        managedBy: true,
        tasks: true,
      },
    })
    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})
