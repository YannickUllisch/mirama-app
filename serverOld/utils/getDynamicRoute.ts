import type { NextRequest } from 'next/server'
import { RouteSegmentNotFoundError } from './types'

const getSegments = (req: NextRequest): string[] => {
  return req.nextUrl.pathname.replace(/\/+$/g, '').split('/').filter(Boolean)
}

export const fromTail = (req: NextRequest, idx = 0): string => {
  const segments = getSegments(req)
  const pos = segments.length - 1 - idx
  if (pos < 0 || idx < 0) throw new RouteSegmentNotFoundError()
  return segments[pos]
}

export const pickFromTail = (req: NextRequest, indices: number[]): string[] => {
  const segments = getSegments(req)
  return indices.map((idx) => {
    const pos = segments.length - 1 - idx
    if (pos < 0 || idx < 0) throw new RouteSegmentNotFoundError()
    return segments[pos]
  })
}
