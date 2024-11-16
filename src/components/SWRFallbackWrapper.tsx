'use client'
import React, { type FC, type PropsWithChildren } from 'react'
import { SWRConfig } from 'swr'

const SWRFallbackWrapper: FC<
  PropsWithChildren<{ fallback: Record<string, unknown> }>
> = ({ children, fallback }) => {
  return <SWRConfig value={{ fallback: fallback }}>{children}</SWRConfig>
}

export default SWRFallbackWrapper
