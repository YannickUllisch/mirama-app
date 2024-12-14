import type { Theme } from '../styles'
import type { TextAndBoxStyleConfig } from '../types/global'

export const getBoxFillStyle = (
  config: TextAndBoxStyleConfig,
  theme: Theme,
) => {
  const { isCurrent, isBusinessDay, variant } = config

  return '#000'
}
