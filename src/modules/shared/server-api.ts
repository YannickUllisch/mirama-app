// src/lib/server-api.ts
import { getAccessToken } from '@src/modules/shared/auth-helpers'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const serverApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:8080'}/api/v1/`,
  adapter: 'fetch',
})

serverApi.interceptors.request.use(async (config) => {
  const token = await getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  config.headers['X-Correlation-ID'] = uuidv4()

  return config
})

export default serverApi
