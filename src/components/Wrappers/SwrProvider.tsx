'use client'
import { api } from '@src/lib/api'
import type { FC, PropsWithChildren } from 'react'
import { toast } from 'sonner'
import { SWRConfig } from 'swr'

const SwrProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: async (key) => {
          if (typeof key === 'string') {
            const response = await api.get(`/${key}`)
            return response.data
          }

          const { url, cacheKey, ...rest } = key

          if (!url) {
            throw new Error(
              'When providing an object as a key, the url property is required',
            )
          }

          const params = Object.entries(rest).reduce<Record<string, any>>(
            (acc, [key, value]) => {
              if (typeof value === 'object' && value !== null) {
                acc[`${key}[]`] = Object.keys(value).filter(
                  (k) => (value as Record<string, boolean>)[k],
                )
              } else {
                acc[key] = value
              }
              return acc
            },
            {},
          )

          const response = await api.get(`/${url}`, { params })
          return response.data
        },
        errorRetryCount: 1,
        onErrorRetry: (error, key) => {
          const regMatch = /url:"([\w/]*)"/g.exec(key)
          let tmpKey = key
          if (regMatch !== null && regMatch.length > 1) {
            tmpKey = regMatch[1]
          }
          toast.error(
            `${tmpKey} error: ${
              error?.response?.data?.message || error?.message || error
            }`,
          )
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}

export default SwrProvider
