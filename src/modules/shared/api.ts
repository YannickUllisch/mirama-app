import axios from 'axios'

const envURL = {
  dev: 'http://localhost:3000',
  prod: process.env.NEXT_PUBLIC_BASE_URL ?? '',
}

export const api = axios.create({
  baseURL: `${
    envURL[(process.env.NEXT_PUBLIC_ENV as 'dev' | 'prod') ?? 'dev']
  }/api/db/`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
