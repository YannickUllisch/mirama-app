'use server'
import { signOut } from '@/auth'
import { AuthError } from 'next-auth'

export const logout = async () => {
  try {
    await signOut({
      redirectTo: '/',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'SignOutError':
          return { error: 'Sign Out Error Occured.' }
        default:
          return { error: 'Authentication Issue.' }
      }
    }
    throw error
  }
}
