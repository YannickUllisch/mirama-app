import { type NextRequest, NextResponse } from 'next/server'
import { Agent, fetch as undiciFetch } from 'undici'

const BACKEND = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://localhost:8080'

const agent = new Agent({
  connect: { rejectUnauthorized: process.env.NODE_ENV !== 'development' },
})

const proxy = async (
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) => {
  const { path } = await params
  const url = `${BACKEND}/api/v1/${path.join('/')}${req.nextUrl.search}`

  const headers: Record<string, string> = {}
  req.headers.forEach((value, key) => {
    if (key !== 'host') headers[key] = value
  })

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'

  const upstream = await undiciFetch(url, {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    dispatcher: agent,
    duplex: 'half',
  })

  const responseHeaders: Record<string, string> = {}
  upstream.headers.forEach((value, key) => {
    responseHeaders[key] = value
  })

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
