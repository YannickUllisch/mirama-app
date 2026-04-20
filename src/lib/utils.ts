import { PriorityType, TaskStatusType } from '@/prisma/generated/client'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

export const getColorByTaskStatusType = (status: string) => {
  switch (status) {
    case TaskStatusType.DONE.toString():
      return 'bg-emerald-500 hover:bg-emerald-400 text-white'
    case TaskStatusType.ACTIVE.toString():
      return 'bg-blue-500 hover:bg-blue-400 text-white'
    case TaskStatusType.NEW.toString():
      return 'bg-gray-400 hover:bg-gray-300 text-white'
    default:
      break
  }
}

export const getColorByPriority = (priority: string) => {
  switch (priority) {
    case PriorityType.LOW.toString():
      return 'bg-emerald-500 hover:bg-emerald-400 text-white'
    case PriorityType.MEDIUM.toString():
      return 'bg-yellow-500 hover:bg-yellow-400 text-white'
    case PriorityType.HIGH.toString():
      return 'bg-red-400 hover:bg-red-300 text-white'
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
