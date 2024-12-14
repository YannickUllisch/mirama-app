import type { FC } from 'react'
import {
  StyledImage,
  StyledImageWrapper,
  StyledInnerWrapper,
  StyledText,
  StyledTextWrapper,
  StyledWrapper,
} from './styles'
import type { LeftColumnItemProps } from './types'
import { User } from 'lucide-react'

const LeftColumnItem: FC<LeftColumnItemProps> = ({
  id,
  item,
  rows,
  onItemClick,
}) => {
  return (
    <StyledWrapper
      title={`${item.title} | ${item.subtitle}`}
      clickable={typeof onItemClick === 'function'}
      rows={rows}
      onClick={() => onItemClick?.({ id, label: item })}
    >
      <StyledInnerWrapper>
        <StyledImageWrapper>
          <User />
        </StyledImageWrapper>
        <StyledTextWrapper>
          <StyledText isMain>{item.title}</StyledText>
          <StyledText>{item.subtitle}</StyledText>
        </StyledTextWrapper>
      </StyledInnerWrapper>
    </StyledWrapper>
  )
}

export default LeftColumnItem
