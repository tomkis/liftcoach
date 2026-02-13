import * as React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'

const Dumbbell = (props: { color: string }) => (
  <Svg width={24} height={24} fill="none">
    <Rect x={1} y={8} width={2} height={8} rx={0.5} stroke={props.color} strokeWidth={1.5} />
    <Rect x={3} y={6} width={3} height={12} rx={0.5} stroke={props.color} strokeWidth={1.5} />
    <Path d="M6 12h12" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
    <Rect x={18} y={6} width={3} height={12} rx={0.5} stroke={props.color} strokeWidth={1.5} />
    <Rect x={21} y={8} width={2} height={8} rx={0.5} stroke={props.color} strokeWidth={1.5} />
  </Svg>
)

export default Dumbbell
