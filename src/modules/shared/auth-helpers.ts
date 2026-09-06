// src/lib/auth-helpers.ts
import { cookies } from 'next/headers'

export const getAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()

  const isProd = process.env.NODE_ENV === 'production'
  const cookieName = isProd ? '__Secure-authjs.session-token' : 'authjs.session-token'

  // Cookie may be chunked (size limit); reassemble all matching parts
  let token = ''
  for (const { name, value } of cookieStore.getAll()) {
    if (name.startsWith(cookieName)) {
      token += value
    }
  }

  if (!token) return null

  // The API's AuthJsTokenHandler picks its dev/prod decryption key from a "0:"/"1:" prefix
  // (see Program.cs's OnMessageReceived, which tags the raw browser cookie the same way).
  // A server-side Bearer request never carries that cookie, so nothing tags it for us here -
  // without this the token is decrypted with the wrong key and every SSR call gets a 401.
  return `${isProd ? '1' : '0'}:${token}`
}
