import type { FC } from 'react'
import { StyledWalker, StyledWrapper } from './styles'
import type { LoaderProps } from './types'

const Loader: FC<LoaderProps> = ({ isLoading, position }) => {
  return isLoading ? (
    <StyledWrapper position={position}>
      <StyledWalker />
    </StyledWrapper>
  ) : null
}

export default Loader
