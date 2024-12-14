import type { FC } from 'react'
import {
  StyledButton,
  StyledIconWrapper,
  StyledText,
  StyledWrapper,
} from './styles'
import type { PaginationButtonProps } from './types'

const PaginationButton: FC<PaginationButtonProps> = ({
  intent,
  onClick,
  icon,
  isVisible,
  pageNum,
  pagesAmount,
}) => {
  const buttonText =
    intent === 'next'
      ? `Load Next ${pageNum + 2}/${pagesAmount}`
      : `Load Prev ${pageNum}/${pagesAmount}`

  return (
    <StyledWrapper intent={intent}>
      <StyledButton onClick={onClick} isVisible={isVisible}>
        {icon && <StyledIconWrapper>{icon}</StyledIconWrapper>}
        <StyledText>{buttonText}</StyledText>
      </StyledButton>
    </StyledWrapper>
  )
}

export default PaginationButton
