'use client'
import React, { type FC, type PropsWithChildren } from 'react'
import { toast } from 'sonner'
import { SWRConfig } from 'swr'

const SwrProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
        errorRetryCount: 1,
        onErrorRetry: (error, key) => {
          const regMatch = /url:"([\w/]*)"/g.exec(key)
          let tmpKey = key
          if (regMatch !== null && regMatch.length > 1) {
            tmpKey = regMatch[1]
          }
          toast.error(
            `${tmpKey} failed with error: ${
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
