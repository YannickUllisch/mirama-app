import { headerHeight } from '@src/components/Scheduler/constants'
import styled from 'styled-components'

export const StyledOuterWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
`

export const StyledWrapper = styled.div`
  height: ${headerHeight}px;
  display: block;
`

export const StyledCanvas = styled.canvas``
