import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Session } from 'next-auth'
import { Role, type TaskStatusType } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

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
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-gray-500',
  'bg-teal-500',
]

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

// Change this hierarchy when adding new Roles.
const roleHierarchy = [
  Role.OBSERVER,
  Role.USER,
  Role.FREELANCE,
  Role.ADMIN,
  Role.OWNER,
]

/**
 * This function returns boolean signifying if Role1 is higher than Role2.
 * @param role1 Role to compare "is higher than" to role 2.
 * @param role2 Role to compare against
 * @returns Boolean if role1 is higher than role2.
 */
export const isRoleHigher = (role1: Role, role2: Role): boolean => {
  return roleHierarchy.indexOf(role1) > roleHierarchy.indexOf(role2)
}

/**
 * This function capitalizes a string or every string in a string[]
 * @param input string | string[] which need to be capitalized
 * @returns capitalized string or string[]
 */
export const capitalize = (input: string | string[]): string | string[] => {
  const capitalizeWord = (str: string) =>
    str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())

  if (Array.isArray(input)) {
    return input.map(capitalizeWord)
  }

  return capitalizeWord(input)
}

export const extractFirstLetters = (inputString: string): string => {
  // Extract the first letter of each word
  const firstLetters = inputString.split(' ').map((word) => word[0])
  // Combine the first letters of the first two words
  const result = firstLetters.slice(0, 2).join('')

  return result
}

const allowedRelations = [
  'users',
  'tasks',
  'taskCategories',
  'tags',
  'assignedTo',
  'user',
]

/**
 * Generate valid PRISMA include through recursive parsing.
 * @param relations Relations to generate include from
 * @param depth starting depth
 * @param maxDepth how many nested relations we at most generate. Necessary for security reasons
 * @returns record of include relations that can be used in Prisma queries.
 */
export const generateInclude = (
  relations: Record<string, any>,
  depth: number,
  maxDepth: number,
): Record<string, any> => {
  if (depth > maxDepth) {
    throw new Error('Maximum include depth exceeded')
  }

  const include: Record<string, any> = {}

  for (const [key, value] of Object.entries(relations)) {
    if (!allowedRelations.includes(key)) {
      throw new Error(`Include relation for '${key}' is now allowed`)
    }
    if (typeof value === 'string') {
      include[key] = { include: { [value]: true } }
    } else if (typeof value === 'boolean') {
      // Direct boolean flag: { key: true }
      include[key] = value
    } else if (typeof value === 'object') {
      include[key] = { include: generateInclude(value, depth + 1, maxDepth) }
    }
  }

  return include
}

export const getColorByTaskStatusType = (status: string) => {
  switch (status) {
    case 'DONE':
      return 'bg-emerald-500 hover:bg-emerald-400 text-white'
    case 'ACTIVE':
      return 'bg-yellow-500 hover:bg-yellow-400 text-white'
    case 'NEW':
      return 'bg-gray-400 hover:bg-gray-300 text-white'
    default:
      break
  }
}

/**
 * Function that brightens or darkens a given hex color
 * @param hex The color to be adjusted
 * @param percentage The amount of adjustment in percent 0-100.
 * @returns Adjusted Hex string
 */
export const adjustBrightness = (hex: string, percentage: number) => {
  const color = hex.startsWith('#') ? hex.slice(1) : hex

  const r = Number.parseInt(color.substring(0, 2), 16)
  const g = Number.parseInt(color.substring(2, 4), 16)
  const b = Number.parseInt(color.substring(4, 6), 16)

  const adjust = (channel: any) =>
    Math.min(255, Math.max(0, channel + (channel * percentage) / 100))

  const newR = adjust(r)
  const newG = adjust(g)
  const newB = adjust(b)

  return `rgb(${newR}, ${newG}, ${newB})`
}

export const calculateBrightness = (hex: string) => {
  const color = hex.startsWith('#') ? hex.slice(1) : hex

  // Parse RGB values
  const r = Number.parseInt(color.substring(0, 2), 16)
  const g = Number.parseInt(color.substring(2, 4), 16)
  const b = Number.parseInt(color.substring(4, 6), 16)

  // Calculate relative luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
