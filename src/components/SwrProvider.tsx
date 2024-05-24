'use client'
import React, { type FC, type PropsWithChildren } from 'react'
import { SWRConfig } from 'swr'

const SwrProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      {children}
    </SWRConfig>
  )
}

export default SwrProvider
