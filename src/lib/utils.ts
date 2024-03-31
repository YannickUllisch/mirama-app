import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'

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
