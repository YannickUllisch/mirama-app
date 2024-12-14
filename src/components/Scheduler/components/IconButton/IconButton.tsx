import { ButtonWrapper } from './styles'
import type { IconButtonProps } from './types'
import { ArrowBigUpDash } from 'lucide-react'

const IconButton = ({
  onClick,
  children,
  isFullRounded,
  isDisabled,
  variant = 'outlined',
}: IconButtonProps) => {
  return (
    <ButtonWrapper
      onClick={onClick}
      isFullRounded={isFullRounded}
      hasChildren={!!children}
      disabled={isDisabled}
      variant={variant}
    >
      <ArrowBigUpDash className={`${'w-[4px] h-[4px]'}`} />
      {children}
    </ButtonWrapper>
  )
}
export default IconButton
