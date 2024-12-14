import PaginationButton from '../PaginationButton/PaginationButton'
import {
  StyledInput,
  StyledInputWrapper,
  StyledLeftColumnHeader,
  StyledWrapper,
} from './styles'
import LeftColumnItem from './LeftColumnItem/LeftColumnItem'
import type { LeftColumnProps } from './types'
import { type FC, useState } from 'react'

import { ArrowDown, ArrowUp, Search } from 'lucide-react'

const LeftColumn: FC<LeftColumnProps> = ({
  data,
  rows,
  onLoadNext,
  onLoadPrevious,
  pageNum,
  pagesAmount,
  searchInputValue,
  onSearchInputChange,
  onItemClick,
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false)

  const toggleFocus = () => setIsInputFocused((prev) => !prev)

  return (
    <StyledWrapper>
      <StyledLeftColumnHeader>
        <StyledInputWrapper isFocused={isInputFocused}>
          <StyledInput
            placeholder={'Search'}
            value={searchInputValue}
            onChange={onSearchInputChange}
            onFocus={toggleFocus}
            onBlur={toggleFocus}
          />
          <Search />
        </StyledInputWrapper>
        <PaginationButton
          intent="previous"
          isVisible={pageNum !== 0}
          onClick={onLoadPrevious}
          icon={<ArrowUp />}
          pageNum={pageNum}
          pagesAmount={pagesAmount}
        />
      </StyledLeftColumnHeader>
      {data.map((item, index) => (
        <LeftColumnItem
          id={item.id}
          item={item.label}
          key={item.id}
          rows={rows[index]}
          onItemClick={onItemClick}
        />
      ))}
      <PaginationButton
        intent="next"
        isVisible={pageNum !== pagesAmount - 1}
        onClick={onLoadNext}
        icon={<ArrowDown />}
        pageNum={pageNum}
        pagesAmount={pagesAmount}
      />
    </StyledWrapper>
  )
}

export default LeftColumn
