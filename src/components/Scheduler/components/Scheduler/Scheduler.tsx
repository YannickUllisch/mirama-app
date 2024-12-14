import { ThemeProvider } from 'styled-components'
import { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { StyledInnerWrapper, StyledOutsideWrapper } from './styles'
import type { SchedulerProps } from './types'
import type { Config } from '../../types/global'
import { darkTheme, GlobalStyle, theme } from '../../styles'
import CalendarProvider from '../../context/CalendarProvider'
import { outsideWrapperId } from '../../constants'
import Calendar from '../Calendar'

const Scheduler = ({
  data,
  config,
  startDate,
  onRangeChange,
  onTileClick,
  onFilterData,
  onClearFilterData,
  onItemClick,
  isLoading,
}: SchedulerProps) => {
  const appConfig: Config = useMemo(
    () => ({
      zoom: 0,
      filterButtonState: 1,
      includeTakenHoursOnWeekendsInDayView: false,
      showTooltip: true,
      translations: undefined,
      ...config,
    }),
    [config],
  )

  const outsideWrapperRef = useRef<HTMLDivElement>(null)
  const [topBarWidth, setTopBarWidth] = useState(
    outsideWrapperRef.current?.clientWidth,
  )
  const defaultStartDate = useMemo(() => dayjs(startDate), [startDate])
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    appConfig.defaultTheme ?? 'light',
  )
  const toggleTheme = () => {
    themeMode === 'light' ? setThemeMode('dark') : setThemeMode('light')
  }

  const currentTheme = themeMode === 'light' ? theme : darkTheme
  const mergedTheme = {
    ...currentTheme,
  }

  useEffect(() => {
    const handleResize = () => {
      if (outsideWrapperRef.current) {
        setTopBarWidth(outsideWrapperRef.current.clientWidth)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!outsideWrapperRef.current) null
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={mergedTheme}>
        <CalendarProvider
          data={data}
          isLoading={!!isLoading}
          config={appConfig}
          onRangeChange={onRangeChange}
          defaultStartDate={defaultStartDate}
          onFilterData={onFilterData}
          onClearFilterData={onClearFilterData}
        >
          <StyledOutsideWrapper
            showScroll={!!data.length}
            id={outsideWrapperId}
            ref={outsideWrapperRef}
          >
            <StyledInnerWrapper>
              <Calendar
                data={data}
                onTileClick={onTileClick}
                topBarWidth={topBarWidth ?? 0}
                onItemClick={onItemClick}
                toggleTheme={toggleTheme}
              />
            </StyledInnerWrapper>
          </StyledOutsideWrapper>
        </CalendarProvider>
      </ThemeProvider>
    </>
  )
}

export default Scheduler
