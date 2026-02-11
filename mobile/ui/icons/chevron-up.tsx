import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const ChevronUp = (props: { color: string; style?: StyleProp<ViewStyle> }) => (
  <Svg width={16} height={16} fill="none" style={props.style}>
    <Path stroke={props.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 11l2-2 2 2" />
  </Svg>
)

export default ChevronUp
