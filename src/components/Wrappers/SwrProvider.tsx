'use client'
import React, { type FC, type PropsWithChildren } from 'react'
import { toast } from 'sonner'
import { SWRConfig } from 'swr'

const SwrProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => {
          if (typeof resource === 'object' && resource.url) {
            return fetch(resource.url, {
              ...init,
              method: resource.method || 'GET', // default to 'GET' if not provided
            }).then((res) => res.json())
          }
          // Otherwise, handle it as a regular URL string
          return fetch(resource, init).then((res) => res.json())
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
