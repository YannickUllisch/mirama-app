import { db } from '@src/lib/db'

export const GET = async (_req: Request) => {
  const response = db.project.findMany({})

  return new Response(JSON.stringify({ response }))
}
