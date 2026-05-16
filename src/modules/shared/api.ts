import axios from 'axios'

const baseURL =
  typeof window === 'undefined'
    ? `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:8080'}/api/v1/`
    : '/api/v1/'

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
