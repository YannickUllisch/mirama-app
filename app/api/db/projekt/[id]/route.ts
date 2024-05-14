import { db } from '@src/lib/db'
import { auth } from '@/auth'

// export const GET = auth(async (req) => {
//   try {
//     const session = req.auth
//     const id = req.nextUrl.const
//     response = await db.project.findMany({
//       where: {
//         teamId: session?.user.teamId,
//       },
//       include: {
//         managedBy: true,
//       },
//       orderBy: {
//         endDate: 'desc',
//       },
//     })

//     return new Response(JSON.stringify(response))
//   } catch (err) {
//     return new Response(JSON.stringify(err))
//   }
// })
