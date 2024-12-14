import type { FC } from 'react'
import { ToggleContainer, ToggleCircle, IconContainer } from './styles'
import type { ToggleProps } from './types'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

const Toggle: FC<ToggleProps> = ({ toggleTheme }) => {
  const theme = useTheme()

  return (
    <ToggleContainer onClick={toggleTheme}>
      <ToggleCircle />
      <IconContainer>
        {theme.theme === 'light' ? <Sun /> : <Moon />}
      </IconContainer>
    </ToggleContainer>
  )
}

export default Toggle
