import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const Pencil = (props: { color?: string; style?: any }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={props.style}>
    <Path
      stroke={props.color || '#000'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"
    />
    <Path stroke={props.color || '#000'} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 5 4 4" />
  </Svg>
)

export default Pencil
