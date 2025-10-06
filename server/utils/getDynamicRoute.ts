import type { NextRequest } from 'next/server'

export const getDynamicRoute = (req: NextRequest) => {
  const tid = req.nextUrl.pathname.split('/').pop()

  if (!tid) throw new Error('ID Required in Request')

  return tid
}
