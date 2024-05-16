import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'
import type { Session } from 'next-auth'
import { Role } from '@prisma/client'
import { getUserById } from '@src/lib/user'
import { db } from '@src/lib/db'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json())

const envURL = {
  dev: 'http://localhost:3000',
  prod: 'https://mirage-management.vercel.app',
}

export const api = axios.create({
  baseURL: `${
    envURL[(process.env.NEXT_PUBLIC_ENV as 'dev' | 'prod') ?? 'dev']
  }/api/db/`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getColorByName = (username: string) => {
  // Hash the username string
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convert hash to a positive integer
  hash = Math.abs(hash)
  const colorIndex = hash % colorClasses.length

  // Return the Tailwind CSS color class
  return colorClasses[colorIndex]
}

// Array of Tailwind CSS color classes
const colorClasses = [
  'bg-red-500/40',
  'bg-blue-500/40',
  'bg-green-500/40',
  'bg-yellow-500/40',
  'bg-indigo-500/40',
  'bg-purple-500/40',
  'bg-pink-500/40',
  'bg-gray-500/40',
  'bg-teal-500/40',
]

export const validateRequest = async (
  session: Session | null,
  roles?: Role[],
) => {
  if (!session) {
    return Response.json(
      {},
      { status: 401, statusText: 'You need to be Logged In' },
    )
  }

  if (roles && !roles.includes(session.user.role)) {
    return Response.json({}, { status: 401, statusText: 'Invalid Permission' })
  }

  if (!session.user.role) {
    return Response.json(
      {},
      { status: 401, statusText: 'You Need to be in Team' },
    )
  }

  return null
}

/**
 * This functions returns a boolean indicating if a specific user ID has Admin or Owner permissionss.
 * @param id a unique user ID
 * @param teamId the teamId for which the role is valid.
 * @returns boolean whether or not user is Admin or Owner
 */
export const isTeamAdminOrOwner = (session: Session | null) => {
  if (!session) {
    return false
  }
  if (session.user.id && session.user.teamId && session.user.role) {
    if (session.user.role === Role.ADMIN || session.user.role === Role.OWNER) {
      return true
    }
  }

  return false
}

export const capitalize = (str: string): string => {
  if (str.length === 0) {
    return str
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const extractFirstLetters = (inputString: string): string => {
  // Extract the first letter of each word
  const firstLetters = inputString.split(' ').map((word) => word[0])
  // Combine the first letters of the first two words
  const result = firstLetters.slice(0, 2).join('')

  return result
}
