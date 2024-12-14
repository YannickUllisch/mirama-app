import styled from 'styled-components'
import type { IconButtonVariant } from './types'

type ButtonWrapperProps = {
  isFullRounded?: boolean
  hasChildren?: boolean
  disabled?: boolean
  variant: IconButtonVariant
}

export const ButtonWrapper = styled.button<ButtonWrapperProps>`
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
  border-radius: ${({ isFullRounded }) => (isFullRounded ? '50%' : '4px')};
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};
  font-size: 14px;
  gap: 4px;
  padding: ${({ hasChildren }) => (hasChildren ? '0 10px' : '0')};
  transition: 0.5s ease;
`
