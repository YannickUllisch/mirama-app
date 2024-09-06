import axios from 'axios'

const envURL = {
  dev: 'http://localhost:3000',
  prod: 'https://mirama.vercel.app',
}

export const api = axios.create({
  baseURL: `${
    envURL[(process.env.NEXT_PUBLIC_ENV as 'dev' | 'prod') ?? 'dev']
  }/api/db/`,
  headers: {
    'Content-Type': 'application/json',
  },
})
