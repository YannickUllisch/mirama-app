import type { FC, MouseEventHandler } from 'react'
import {
  NavigationWrapper,
  Wrapper,
  NavBtn,
  Today,
  Zoom,
  Filters,
  OptionsContainer,
} from './styles'
import type { TopbarProps } from './types'
import { useCalendar } from '@src/components/Scheduler/context/CalendarProvider'
import { ArrowLeft, ArrowRight, Minus, Plus, X } from 'lucide-react'
import Toggle from '../../../Toggle'
import { Button } from '@src/components/ui/button'

const Topbar: FC<TopbarProps> = ({ width, showThemeToggle, toggleTheme }) => {
  const {
    data,
    config,
    handleGoNext,
    handleGoPrev,
    handleGoToday,
    zoomIn,
    zoomOut,
    // isNextZoom,
    // isPrevZoom,
    handleFilterData,
    onClearFilterData,
  } = useCalendar()
  const { filterButtonState = -1 } = config

  const handleClearFilters: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    onClearFilterData?.()
  }

  return (
    <Wrapper width={width}>
      <Filters>
        {filterButtonState >= 0 && (
          <Button onClick={handleFilterData}>
            Filters
            {!!filterButtonState && (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
              <span onClick={handleClearFilters}>
                <X />
              </span>
            )}
          </Button>
        )}
      </Filters>
      <NavigationWrapper>
        <NavBtn disabled={!data?.length} onClick={handleGoPrev}>
          <ArrowLeft />
          Prev
        </NavBtn>
        <Today onClick={handleGoToday}>Today</Today>;
        <NavBtn disabled={!data?.length} onClick={handleGoNext}>
          Next
          <ArrowRight />
        </NavBtn>
      </NavigationWrapper>
      <OptionsContainer>
        {showThemeToggle && <Toggle toggleTheme={toggleTheme} />};
        <Zoom>
          View
          <Minus onClick={zoomOut} />
          {/* <IconButton
            isDisabled={!isPrevZoom}
            onClick={zoomOut}
            isFullRounded
            iconName="subtract"
            width="14"
          /> */}
          <Plus onClick={zoomIn} />
          {/* <IconButton
            isDisabled={!isNextZoom}
            onClick={zoomIn}
            isFullRounded
            iconName="add"
            width="14"
          /> */}
        </Zoom>
      </OptionsContainer>
    </Wrapper>
  )
}
export default Topbar
