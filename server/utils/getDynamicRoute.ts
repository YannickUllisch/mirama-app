import type { NextRequest } from 'next/server'

export const getDynamicRoute = (req: NextRequest) => {
  const id = req.nextUrl.pathname.split('/').pop()
  if (!id) throw new Error('ID Required in Request')
  return id
}
