import {
  outsideWrapperId,
  leftColumnWidth,
  screenWidthMultiplier,
} from '../constants'

export const getCanvasWidth = () => {
  if (!document) return 0
  // const wrapperWidth =
  //   document.getElementById(outsideWrapperId)?.clientWidth || 0
  const width = (0 - leftColumnWidth) * screenWidthMultiplier
  return width
}
