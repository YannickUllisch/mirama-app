// src/lib/auth-helpers.ts
import { cookies } from 'next/headers'

export const getAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()

  const cookieName =
    process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token'

  // Cookie may be chunked (size limit); reassemble all matching parts
  let token = ''
  for (const { name, value } of cookieStore.getAll()) {
    if (name.startsWith(cookieName)) {
      token += value
    }
  }

  return token || null
}
