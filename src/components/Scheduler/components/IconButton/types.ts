import type { ReactNode } from 'react'

export type IconButtonVariant = 'outlined' | 'filled'

export type IconButtonProps = {
  onClick?: () => void
  children?: ReactNode
  isFullRounded?: boolean
  isDisabled?: boolean
  variant?: IconButtonVariant
}
