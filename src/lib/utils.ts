import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const envURL = {
  dev: 'http://localhost:3000',
  prod: 'https://mirage-management.vercel.app',
}

export const api = axios.create({
  baseURL: `${
    envURL[(process.env.NEXT_PUBLIC_ENV as 'dev' | 'prod') ?? 'dev']
  }/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(undefined, (err) => {
  return Promise.reject(err.response?.data?.message || err.message || err)
})
