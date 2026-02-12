import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const ChevronLeft = (props: { color: string; size?: number; style?: StyleProp<ViewStyle> }) => {
  const s = props.size ?? 16
  return (
    <Svg width={s} height={s} fill="none" viewBox="0 0 16 16" style={props.style}>
      <Path stroke={props.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M10 4l-4 4 4 4" />
    </Svg>
  )
}

export default ChevronLeft
