import axios from 'axios'

const _envURL = {
  dev: process.env.NEXT_PUBLIC_BASE_URL ?? '',
  prod: process.env.NEXT_PUBLIC_BASE_URL ?? '',
}

export const api = axios.create({
  baseURL: `/api/v1/`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
